import { css, html, LitElement, property } from "lit-element";
import { BaseColumnLayout } from "./layouts/base-column-layout";
import { CardConfig, LayoutCardConfig, LovelaceCard } from "./types";

class LayoutCard extends LitElement {
  @property() hass;
  @property() editMode = false;
  @property() isPanel = false;
  @property() _config: LayoutCardConfig;
  @property() _cards: Array<LovelaceCard> = [];
  @property() _layoutElement?: BaseColumnLayout;

  @property() _layoutType?: string;

  setConfig(config: LayoutCardConfig) {
    this._config = { ...config };

    if (this._config.entities) {
      this._config.cards = this._config.entities.map((e) =>
        e.type ? e : { ...e, type: "entity" }
      );
    }

    let configType = config.layout_type;
    if (configType) {
      if (!configType?.endsWith("-layout")) configType += "-layout";
      if (configType.startsWith("custom:"))
        configType = configType.substr("custom:".length);
    } else {
      configType = "hui-masonry-view";
    }
    this._layoutType = configType;
  }

  async updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    if (
      changedProperties.has("_layoutType") ||
      changedProperties.has("_config")
    ) {
      const viewConfig = {
        type: this._layoutType,
        layout: this._config.layout || this._config.layout_options,
        cards: this._config.cards,
      };
      const layoutElement = document.createElement(
        this._layoutType
      ) as BaseColumnLayout;
      layoutElement.setConfig(viewConfig);
      this._layoutElement = layoutElement;
      await this._createCards();
      this._layoutElement.hass = this.hass;
      this._layoutElement.narrow = false;
      this._layoutElement.lovelace = {
        ...this._getLovelace(),
        editMode: false,
      };
      this._layoutElement.index = 1;
    }

    if (changedProperties.has("hass")) {
      this._cards.forEach((card) => {
        card.hass = this.hass;
      });
      if (this._layoutElement) this._layoutElement.hass = this.hass;
    }
    if (changedProperties.has("_cards")) {
      if (this._layoutElement) this._layoutElement.cards = this._cards;
    }
    if (changedProperties.has("editMode")) {
      if (this._layoutElement)
        this._layoutElement.lovelace = {
          ...this._getLovelace(),
          editMode: false,
        };
    }
  }

  _getLovelace(el: any = this) {
    if (el.lovelace) return el.lovelace;
    if (el.localName === "home-assistant") return undefined;
    if (el.parentElement && (el.parentElement as any).host)
      return this._getLovelace((el.parentElement as any).host);
    if (el.parentNode && (el.parentNode as any).host)
      return this._getLovelace((el.parentNode as any).host);
    if (el.parentElement) return this._getLovelace(el.parentElement);
    if (el.parentNode) return this._getLovelace(el.parentNode);
  }

  _createCard(cardConfig: CardConfig, cardHelpers: any): LovelaceCard {
    const el = cardHelpers.createCardElement(cardConfig);
    el.addEventListener("ll-rebuild", (ev: Event) => {
      ev.stopPropagation();
      this._rebuildCard(el, cardConfig);
    });
    el.hass = this.hass;
    return el;
  }

  async _createCards() {
    const cardHelpers = await (window as any).loadCardHelpers();
    this._cards = this._config.cards.map((cardConfig) => {
      return this._createCard(cardConfig, cardHelpers);
    });
  }

  async _rebuildCard(el: LovelaceCard, cardConfig: CardConfig) {
    const cardHelpers = await (window as any).loadCardHelpers();
    const newEl = this._createCard(cardConfig, cardHelpers);
    if (el.parentElement) {
      el.parentElement.replaceChild(newEl, el);
    }
    this._cards = this._cards.map((card) => (card === el ? newEl : card));
  }

  render() {
    return html`${this._layoutElement}`;
  }

  static get styles() {
    return css`
      :host(:not(:first-child)) {
        margin-top: 0 !important;
      }
      :host(:not(:last-child)) {
        margin-bottom: 0 !important;
      }
    `;
  }

  static getConfigElement() {
    return document.createElement("layout-card-editor");
  }
  static getStubConfig() {
    return {
      layout_type: "masonry",
      layout: {},
      cards: [],
    };
  }
}

customElements.define("layout-card", LayoutCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "layout-card",
  name: "Layout Card",
  preview: false,
  description: "Like a stack card, but with way more control.",
});
