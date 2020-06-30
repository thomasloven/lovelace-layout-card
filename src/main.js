import { LitElement, html, css } from "card-tools/src/lit-element";
import { createCard } from "card-tools/src/lovelace-element";
import { hass } from "card-tools/src/hass";

import {buildLayout} from "./layout";

import { ResizeObserver } from "resize-observer";

class LayoutCard extends LitElement {

  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }

  async setConfig(config) {
    this._config = {
      layout: "auto",
      min_height: 5,

      column_width: 300,
      max_width: config.column_width || "500px",

      min_columns: config.column_num || 1,
      max_columns: config.column_num || 100,
      sidebar_column: false,

      ...config,
    }

    this.cards = [];
    this.columns = [];
    this._layoutWidth = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    let el = this.parentElement;
    let steps = 10;
    while(steps-- && el) {
      if(el.tagName === "HUI-PANEL-VIEW")
        this.classList.add("panel");
      else if(el.tagName === "HUI-VERTICAL-STACK-CARD")
        this.classList.add("stacked");
      else if(el.tagName !== "DIV" && el.id !== "root")
        break;
      if(el.parentElement)
        el = el.parentElement;
      else
        el = el.getRootNode().host;
    }
  }

  async firstUpdated() {
    window.addEventListener('location-changed', () => {
      if(location.hash === "") {
        setTimeout(() => this.updateSize(), 100)
      }
    });
    if(!this.resizer) {
      this.resizer = new ResizeObserver(() => {
        this.updateSize()
      });
      this.resizer.observe(this);
    }
    this.updateSize();
  }

  async updateSize() {
    let width = this.getBoundingClientRect().width;
    if (this.classList.contains("panel")
      && (!window.matchMedia("(max-width: 870px)").matches)
      && this._config.sidebar_column) {
      if (this.hass && this.hass.dockedSidebar === "docked") {
        width += 256;
      } else {
        width += 64;
      }
    }
    // narrow if max-width: 870px
    if(width && Math.abs(width-this._layoutWidth) > 50) {
      this._layoutWidth = width;
      this.resizer.disconnect();
      await this.place_cards();
      this.requestUpdate().then(() => this.resizer.observe(this));
    }
  }

  async updated(changedproperties) {
    if(!this.cards.length
      && ((this._config.entities && this._config.entities.length)
        || (this._config.cards && this._config.cards.length))
      ) {
      // Build cards and layout
      const width = this.clientWidth;
      this.cards = await this.build_cards();
      await this.place_cards();
      this.requestUpdate();
    }

    if(changedproperties.has("hass") && this.hass && this.cards) {
      // Update the hass object of every card
      for (const c of this.cards) {
        if(!c) continue;
        c.hass = this.hass;
      }
    }
  }

  async build_card(c) {
      if(c === "break") {
        if(this._config.layout === "grid")
        {
          const el = document.createElement("div");
          this.shadowRoot.querySelector("#staging").appendChild(el);
          return el;
        }
        return null;
      }
      const config = {...c, ...this._config.card_options};
      const el = createCard(config);
      el.hass = hass();

      if(this._config.layout === "grid") {
        el.style.gridColumn = config.gridcol || "auto";
        el.style.gridRow = config.gridrow || "auto";
      }
      // Cards are initially placed in the staging area
      // That places them in the DOM and lets us read their getCardSize() function
      this.shadowRoot.querySelector("#staging").appendChild(el);
      return new Promise((resolve, reject) =>
        el.updateComplete
          ? el.updateComplete.then(() => resolve(el))
          : resolve(el)
        );
  }

  async build_cards() {
    // Clear out any cards in the staging area which might have been built but not placed
    const staging = this.shadowRoot.querySelector("#staging");
    while(staging.lastChild)
      staging.removeChild(staging.lastChild);
    return Promise.all(
      (this._config.entities || this._config.cards)
        .map((c) => this.build_card(c))
    );
  }

  async place_cards() {
    if(this._config.layout === "grid")
      return;
    if(!this.cards.length)
      return;
    this.columns = await buildLayout(
      this.cards,
      this._layoutWidth || 1,
      this._config
    );

    if(this._config.rtl)
      this.columns.reverse();

    this.format_columns();
  }

  format_columns() {
    const renderProp = (name, property, index, unit="px") => {
      // Check if the config option is specified
      if (this._config[property] === undefined) return "";

      let retval =  `${name}: `;
      const prop = this._config[property];
      if (typeof(prop) === "object")
        // Get the last value if there are not enough
        if(prop.length > index)
          retval += `${prop[index]}`;
        else
          retval += `${prop.slice(-1)}`;
      else
        retval += `${prop}`;

      // Add unit (px) if necessary
      if(!retval.endsWith("px") && !retval.endsWith("%")) retval += unit;
      return retval + ";"
    }

    // Set element style for each column
    for(const [i, c] of this.columns.entries()) {
      const styles = [
        renderProp("max-width", "max_width", i),
        renderProp("min-width", "min_width", i),
        renderProp("width", "column_width", i),
        renderProp("flex-grow", "flex_grow", i, ""),
      ]
      c.style.cssText = ''.concat(...styles);
    }
  }

  getCardSize() {
    if(this.columns && this.columns.length)
      return Math.max.apply(Math, this.columns.map((c) => c.length));
    if(this._config.entities)
      return 2*this._config.entities.length;
    if(this._config.cards)
      return 2*this._config.cards.length;
    return 1;
  }

  render() {
    if(this._config.layout === "grid")
      return html`
        <div id="staging" class="grid"
        style="
        display: grid;
        grid-template-rows: ${this._config.gridrows || "auto"};
        grid-template-columns: ${this._config.gridcols || "auto"};
        grid-gap: ${this._config.gridgap || "auto"};
        place-items: ${this._config.gridplace || "auto"};
        "></div>
      `;
    return html`
      <div id="columns"
      style="
      ${this._config.justify_content ? `justify-content: ${this._config.justify_content};` : ''}
      ">
        ${this.columns.map((col) => html`
          ${col}
        `)}
      </div>
      <div id="staging"></div>
    `;
  }

  static get styles() {
    return css`
      :host {
        padding: 0;
        display: block;
        margin-bottom: 0!important;
      }
      :host(.panel) {
        padding: 0 4px;
        margin-top: 8px;
      }
      :host(.panel.stacked:first-child) {
        margin-top: 8px !important;
      }
      @media(max-width: 500px) {
        :host(.panel) {
          padding-left: 0px;
          padding-right: 0px;
        }
      }

      #columns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: -8px;
      }

      .column {
        flex-basis: 0;
        flex-grow: 1;
        overflow-x: hidden;
      }
      .column:first-child {
        margin-left: -4px;
      }
      .column:last-child {
        margin-right: -4px;
      }
      :host(.panel) .column {
        margin: 0;
      }


      .cards>*,
      .grid>* {
        display: block;
        margin: 4px 4px 8px;
      }
      .cards>*:first-child {
        margin-top: 8px;
      }
      .cards>*:last-child {
        margin-bottom: 4px;
      }
      @media(max-width: 500px) {
        .cards:first-child>*,
        .grid>* {
          margin-left: 0px;
        }
        .cards:last-child>*,
        .grid>* {
          margin-right: 0px;
        }
      }

      #staging:not(.grid) {
        visibility: hidden;
        height: 0;
      }
      #staging.grid {
        margin: 0 -4px;
      }
    `;
  }

  // Compatibility with legacy card-modder
  get _cardModder() {
    return {target: this};
  }

}

if(!customElements.get("layout-card")) {
  customElements.define("layout-card", LayoutCard);
  const pjson = require('../package.json');
  console.info(`%cLAYOUT-CARD ${pjson.version} IS INSTALLED`,
  "color: green; font-weight: bold",
  "");
}
