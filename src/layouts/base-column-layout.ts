import { css, html } from "lit";
import { property } from "lit/decorators.js";
import {
  CardConfigGroup,
  CardConfig,
  LovelaceCard,
  HuiCard,
  ColumnViewConfig,
} from "../types";
import { ResizeObserver } from "resize-observer/lib/ResizeObserver";
import { BaseLayout } from "./base-layout";

export class BaseColumnLayout extends BaseLayout {
  @property() _columns?: number;
  @property() _config: ColumnViewConfig;

  _observer?: ResizeObserver;
  _cardObserver?: MutationObserver;
  _mediaQueries: Array<MediaQueryList | null> = [];

  async setConfig(config: ColumnViewConfig) {
    await super.setConfig(config);

    for (const card of this._config.cards) {
      if (
        typeof card.view_layout?.show !== "string" &&
        card.view_layout?.show?.mediaquery
      ) {
        const mq = window.matchMedia(`${card.view_layout.show.mediaquery}`);
        this._mediaQueries.push(mq);
        mq.addEventListener("change", () => this._makeLayout());
      } else {
        this._mediaQueries.push(null);
      }
    }

    if (this._observer) this._observer.disconnect();
    this._observer = new ResizeObserver(() => {
      this._updateSize();
    });
    if (this._cardObserver) this._cardObserver.disconnect();
    if (config.layout?.reflow) {
      this._cardObserver = new MutationObserver((mutationlist) => {
        for (const mutation of mutationlist) {
          if (
            mutation.type === "attributes" &&
            (mutation.attributeName === "style" ||
              mutation.attributeName === "hidden")
          ) {
            this._makeLayout();
          }
        }
      });
    }
  }

  async updated(changedProperties: Map<string, any>) {
    await super.updated(changedProperties);
    if (changedProperties.has("_columns") || changedProperties.has("cards")) {
      this._makeLayout();
    }
    if (changedProperties.has("_editMode")) {
      this._makeLayout();
    }
    if (
      changedProperties.has("narrow") ||
      (changedProperties.has("hass") &&
        changedProperties.get("hass")?.dockedSidebar != this.hass.dockedSidebar)
    ) {
      this._updateSize();
      this._makeLayout();
    }
  }

  async firstUpdated() {
    this._updateSize();

    const column_width = this._config.layout?.width || 300;
    const column_max_width =
      this._config.layout?.max_width ||
      (this._config.layout?.width
        ? Math.ceil(this._config.layout?.width * 1.5)
        : 500);
    const column_two_width = this._config.layout?.width
      ? this._config.layout.width * 2
      : 600;

    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      :host {
        --column-max-width: ${column_max_width}px;
        --column-width: ${column_width}px;
        --column-widths: ${this._config.layout?.column_widths ?? "none"};
        --layout-margin: ${this._config.layout?.margin ?? "4px 4px 0px 4px"};
        --layout-padding: ${this._config.layout?.padding ?? "0px"};
        --card-margin: ${
          this._config.layout?.card_margin ??
          "var(--masonry-view-card-margin, 4px 4px 8px)"
        };
        --layout-height: ${this._config.layout?.height ?? "auto"};
        --layout-overflow: ${
          this._config.layout?.height !== undefined ? "auto" : "visible"
        };
      }
      @media (max-width: ${column_max_width}px) {
        .column:first-child > * {
          margin-left: 0;
        }
        .column:last-child > * {
          margin-right: 0;
        }
      }
      @media (max-width: ${column_two_width - 1}px) {
        .column {
          --column-max-width: ${column_two_width}px;
        }
      }
    `;
    this.shadowRoot.appendChild(styleEl);
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateSize();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }

  async _updateSize() {
    let width = this.getBoundingClientRect().width;
    let colnum = 0;
    colnum = Math.floor(width / (this._config.layout?.width || 300));
    colnum = Math.min(
      colnum,
      this._config.layout?.max_cols ||
        (this.hass?.dockedSidebar === "docked" ? 3 : 4)
    );
    colnum = Math.max(colnum, 1);
    if (colnum !== this._columns) {
      this._columns = colnum;
    }
  }

  _shouldShow(card: LovelaceCard | HuiCard, config: CardConfig, index: number) {
    if (!super._shouldShow(card, config, index)) return false;

    if (this._config.layout?.reflow) {
      if (getComputedStyle(card).display === "none") return false;
      if (card.hidden === true) return false;
    }

    const mq = this._mediaQueries[index];
    if (!mq) return true;
    if (mq.matches) return true;
    return false;
  }

  isBreak(config: CardConfig) {
    return config.type === "custom:layout-break";
  }

  async _makeLayout() {
    this._makeColumnLayout();
  }

  async _makeColumnLayout() {
    this._observer.disconnect();
    if (this._cardObserver) {
      this._cardObserver.disconnect();
    }
    if (!this._columns) return;
    let cols = [];
    for (let i = 0; i < this._columns; i++) {
      const newCol = document.createElement("div") as any;
      newCol.classList.add("column");
      newCol.length = 0;
      cols.push(newCol);
    }

    let cards: CardConfigGroup[] = this.cards.map((card, index) => {
      const config = this._config.cards[index];
      return {
        card,
        config,
        index,
        show: this._shouldShow(card, config, index),
      };
    });
    await this._placeColumnCards(
      cols,
      cards.filter((c) => this.lovelace?.editMode || c.show)
    );

    cols = cols.filter((c) => c.childElementCount > 0);
    if (this._config.layout?.rtl) {
      cols.reverse();
    }

    const columns = this.shadowRoot.querySelector("#columns");
    while (columns.firstChild) columns.removeChild(columns.firstChild);

    if (this._cardObserver) {
      for (const card of this.cards) {
        this._cardObserver.observe(card, { attributes: true });
      }
    }

    for (const col of cols) columns.appendChild(col);
    this.requestUpdate();
    await this.updateComplete;
    this._observer.observe(this);
  }

  async _placeColumnCards(cols: Array<Node>, cards: CardConfigGroup[]) {}

  render() {
    return html`
      <div id="columns"></div>
      ${this._render_fab()}
    `;
  }

  static get styles() {
    return [
      this._fab_styles,
      css`
        :host {
          display: block;
          height: 100%;
          box-sizing: border-box;
          overflow-y: var(--layout-overflow);
        }

        #columns {
          display: grid;
          grid-auto-columns: minmax(
            var(--column-width),
            var(--column-max-width)
          );
          grid-template-columns: var(--column-widths);
          justify-content: center;
          justify-items: center;
          margin: var(--layout-margin);
          padding: var(--layout-padding);
          height: var(--layout-height);
          overflow-y: var(--layout-overflow);
        }
        .column {
          grid-row: 1/2;
          max-width: var(--column-max-width);
          width: 100%;
        }
        .column > * {
          display: block;
          margin: var(--card-margin);
        }
      `,
    ];
  }
}
