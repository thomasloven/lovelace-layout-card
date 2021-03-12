import { css, html, LitElement, property } from "lit-element";
import {
  CardConfigGroup,
  LayoutCardConfig,
  LovelaceCard,
  MasonryViewConfig,
  ViewConfig,
} from "../types";
import { ResizeObserver } from "resize-observer/lib/ResizeObserver";
import bind from "bind-decorator";

export class BaseLayout extends LitElement {
  @property() cards: Array<LovelaceCard>;
  @property() index: number;
  @property() _columns?: number;
  @property() narrow: boolean;
  @property() hass;
  @property() _config: MasonryViewConfig;
  _observer?: ResizeObserver;
  _mediaQueries: Array<MediaQueryList | null> = [];

  async setConfig(config: MasonryViewConfig) {
    this._config = { ...config };

    for (const card of this._config.cards) {
      if (
        typeof card.layout?.show !== "string" &&
        card.layout?.show?.mediaquery
      ) {
        const mq = window.matchMedia(`${card.layout.show.mediaquery}`);
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
    if (changedProperties.has("_columns") || changedProperties.has("cards")) {
      this._makeLayout();
    }
    if (changedProperties.has("narrow")) this._updateSize();
  }

  async firstUpdated() {
    this._updateSize();

    const column_max_width =
      this._config.layout?.max_width || this._config.layout?.width
        ? Math.ceil(this._config.layout?.width * 1.5)
        : 500;
    const column_two_width = this._config.layout?.width
      ? this._config.layout.width * 2
      : 600;
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      :host {
        --column-max-width: ${column_max_width}px;
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
    colnum = Math.min(colnum, this._config.layout?.max_cols || 100);
    colnum = Math.max(colnum, 1);
    if (colnum !== this._columns) {
      this._columns = colnum;
    }
  }

  @bind
  _filterCards(card: CardConfigGroup, index: number) {
    if (card.config.layout?.show === "always") return true;
    if (card.config.layout?.show === "never") return false;
    const mq = this._mediaQueries[index];
    if (mq) {
      if (mq.matches) return true;
      return false;
    }
    return true;
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

    const cards: CardConfigGroup[] = this.cards.map((c, i) => {
      return { card: c, config: this._config.cards[i] };
    });
    await this._placeColumnCards(cols, cards.filter(this._filterCards));

    cols = cols.filter((c) => c.childElementCount > 0);

    const columns = this.shadowRoot.querySelector("#columns");
    while (columns.firstChild) columns.removeChild(columns.firstChild);

    for (const col of cols) columns.appendChild(col);
    this.requestUpdate().then(() => this._observer.observe(this));
  }

  async _placeColumnCards(cols: Array<Node>, cards: CardConfigGroup[]) {}

  render() {
    return html` <div id="columns"></div> `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding-top: 4px;
        height: 100%;
        box-sizing: border-box;
      }

      #columns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-left: 4px;
        margin-right: 4px;
      }
      .column {
        flex: 1 0 0;
        max-width: var(--column-max-width);
        min-width: 0;
      }
      .column > * {
        display: block;
        margin: var(--masonry-view-card-margin, 4px 4px 8px);
      }
    `;
  }
}
