import { css, html, LitElement, property } from "lit-element";
import { LovelaceCard } from "../types";

class GridLayout extends LitElement {
  @property() cards: Array<LovelaceCard> = [];
  @property() index: number;
  @property() narrow: boolean;
  @property() hass;
  @property() _config: any;

  async setConfig(config: any) {
    this._config = { ...config };
  }

  async updated(changedProperties) {
    if (changedProperties.has("cards")) {
      const root = this.shadowRoot.querySelector("#root");
      while (root.firstChild) root.removeChild(root.firstChild);
      for (const [index, card] of this.cards.entries()) {
        const cardConfig = this._config.cards[index];
        for (const [key, value] of Object.entries(cardConfig?.layout || {})) {
          if (key.startsWith("grid"))
            card.style.setProperty(key, value as string);
        }
        root.appendChild(card);
      }
    }
  }

  async firstUpdated() {
    const root = this.shadowRoot.querySelector("#root") as HTMLElement;
    if (this._config.layout)
      for (const [key, value] of Object.entries(this._config.layout)) {
        if (key.startsWith("grid"))
          root.style.setProperty(key, value as string);
      }
  }

  render() {
    return html` <div id="root"></div> `;
  }
  static get styles() {
    return css`
      :host {
        padding-top: 4px;
        height: 100%;
        box-sizing: border-box;
      }
      #root {
        display: grid;
        margin-left: 4px;
        margin-right: 4px;
      }
      #root > * {
        margin: var(--masonry-view-card-margin, 4px 4px 8px);
      }
    `;
  }
}

customElements.define("grid-layout", GridLayout);
