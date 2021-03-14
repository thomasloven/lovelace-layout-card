import { css, html } from "lit-element";
import { CardConfigGroup } from "../types";
import { BaseLayout } from "./base-layout";

class GridLayout extends BaseLayout {
  async updated(changedProperties) {
    await super.updated(changedProperties);
    if (changedProperties.has("cards") || changedProperties.has("_editMode")) {
      this._placeCards();
    }
  }

  async firstUpdated() {
    const root = this.shadowRoot.querySelector("#root") as HTMLElement;
    if (this._config.layout)
      for (const [key, value] of Object.entries(this._config.layout)) {
        if (key.startsWith("grid"))
          root.style.setProperty(key, (value as any) as string);
      }
  }

  _placeCards() {
    const root = this.shadowRoot.querySelector("#root");
    while (root.firstChild) root.removeChild(root.firstChild);
    let cards: CardConfigGroup[] = this.cards.map((card, index) => {
      const config = this._config.cards[index];
      return {
        card,
        config,
        index,
        show: this._shouldShow(card, config, index),
      };
    });
    for (const card of cards) {
      const el = this.getCardElement(card);
      for (const [key, value] of Object.entries(card.config?.layout ?? {})) {
        if (key.startsWith("grid")) el.style.setProperty(key, value as string);
      }
      root.appendChild(el);
    }
  }

  render() {
    return html` <div id="root"></div>
      ${this._render_fab()}`;
  }
  static get styles() {
    return [
      this._fab_styles,
      css`
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
      `,
    ];
  }
}

customElements.define("grid-layout", GridLayout);
