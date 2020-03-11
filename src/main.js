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
      min_height: 5,

      column_width: 300,
      max_width: config.column_width || "500px",

      min_columns: config.column_num || 1,
      max_columns: 100,

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
      if(el.tagName === "DIV")
        break;
    }
  }

  async firstUpdated() {
    window.addEventListener('location-changed', () => {
      if(location.hash === "")
        setTimeout(() => this.updateSize(), 100)
    });
    if(!this.resizer) {
      this.resizer = new ResizeObserver(() => this.updateSize());
      this.resizer.observe(this);
    }
    this.updateSize();
  }

  updateSize() {
    const width = this.getBoundingClientRect().width;
    if(width && width !== this._layoutWidth) {
      this._layoutWidth = width;
      this.resizer.disconnect();
      this.place_cards();
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
      this.place_cards();
      this.requestUpdate();
    }

    if(changedproperties.has("hass") && this.hass && this.cards) {
      // Update the hass object of every card
      this.cards.forEach((c) => {
        if(!c) return;
        c.hass = this.hass;
      });
    }
  }

  async build_card(c) {
      if(c === "break")
        return null;
      const config = {...c, ...this._config.card_options};
      const el = createCard(config);
      el.hass = hass();

      el.style.gridColumn = config.gridcol;
      el.style.gridRow = config.gridrow;
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

  place_cards() {
    if(this._config.layout === "grid")
      return;
    if(!this.cards.length)
      return;
    this.columns = buildLayout(
      this.cards,
      this._layoutWidth || 1,
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
    if(this.columns)
      return Math.max.apply(Math, this.columns.map((c) => c.length));
  }

  render() {
    if(this._config.layout === "grid")
      return html`
        <div id="staging" class="grid"
        style="
        display: grid;
        grid-template-rows: ${this._config.gridrows};
        grid-template-columns: ${this._config.gridcols};
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
