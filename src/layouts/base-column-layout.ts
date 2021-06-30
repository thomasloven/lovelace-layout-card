import { css, html, property } from "lit-element";
import {
  CardConfigGroup,
  CardConfig,
  LovelaceCard,
  ColumnViewConfig,
} from "../types";
import { ResizeObserver } from "resize-observer/lib/ResizeObserver";
import { BaseLayout } from "./base-layout";

export class BaseColumnLayout extends BaseLayout {
  @property() _columns?: number;
  @property() _config: ColumnViewConfig;

  _observer?: ResizeObserver;
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

  _shouldShow(card: LovelaceCard, config: CardConfig, index: number) {
    if (!super._shouldShow(card, config, index)) return false;

    const mq = this._mediaQueries[index];
    if (!mq) return true;
    if (mq.matches) return true;
    return false;
  }

  isBreak(card: LovelaceCard) {
    return card.localName === "layout-break";
  }

  async _makeLayout() {
    this._makeColumnLayout();
  }

  async _makeColumnLayout() {
    this._observer.disconnect();
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

    for (const col of cols) columns.appendChild(col);
    this.requestUpdate().then(() => this._observer.observe(this));
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
          padding-top: 4px;
          height: 100%;
          box-sizing: border-box;
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
          margin-left: 4px;
          margin-right: 4px;
        }
        .column {
          grid-row: 1/2;
          max-width: var(--column-max-width);
          width: 100%;
        }
        .column > * {
          display: block;
          margin: var(--masonry-view-card-margin, 4px 4px 8px);
        }
      `,
    ];
  }
}
