import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import {
  CardConfig,
  CardConfigGroup,
  HuiCard,
  LovelaceCard,
  ViewConfig,
} from "../types";

export class BaseLayout extends LitElement {
  @property() cards: Array<LovelaceCard | HuiCard> = [];
  @property() index: number;
  @property() narrow: boolean;
  @property() hass;
  @property() lovelace: any;
  @property() _editMode: boolean = false;
  _editorLoaded = false;

  @property() _config: ViewConfig;

  async setConfig(config: ViewConfig) {
    this._config = { ...config };
    if (this._config.view_layout && this._config.layout === undefined) {
      // Maybe avoid a bit of confusion...
      this._config.layout = this._config.view_layout;
    }
  }

  async updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has("lovelace") &&
      this.lovelace?.editMode != changedProperties.get("lovelace")?.editMode
    ) {
      if (this.lovelace?.editMode && !this._editorLoaded) {
        this._editorLoaded = true;
        {
          // Load in editor elements
          const loader = document.createElement("hui-masonry-view");
          (loader as any).lovelace = { editMode: true };
          (loader as any).willUpdate(new Map());
        }
      }
      this.cards.forEach((c) => (c.editMode = this.lovelace?.editMode));
      this._editMode = this.lovelace?.editMode ?? false;
    }
  }

  _shouldShow(card: LovelaceCard | HuiCard, config: CardConfig, index: number) {
    if (config.view_layout?.show === "always") return true;
    if (config.view_layout?.show === "never") return false;
    if (
      config.view_layout?.show?.sidebar === "shown" &&
      (this.hass?.dockedSidebar === "auto" || this.narrow)
    )
      return false;
    if (
      config.view_layout?.show?.sidebar === "hidden" &&
      this.hass?.dockedSidebar === "docked" &&
      !this.narrow
    )
      return false;
    return true;
  }

  getCardElement(card: CardConfigGroup) {
    if (!this.lovelace?.editMode) return card.card;
    const wrapper = document.createElement("hui-card-options") as any;
    wrapper.hass = this.hass;
    wrapper.lovelace = this.lovelace;
    wrapper.path = [this.index, card.index];
    card.card.editMode = true;
    wrapper.appendChild(card.card);
    if (card.show === false) wrapper.style.border = "1px solid red";
    return wrapper;
  }

  _addCard() {
    this.dispatchEvent(new CustomEvent("ll-create-card"));
  }

  _render_fab() {
    if (!this.lovelace?.editMode === true) return html``;
    return html`
      <ha-fab .label=${"Add card"} extended @click=${this._addCard}>
        <ha-icon slot="icon" .icon=${"mdi:plus"}></ha-icon>
      </ha-fab>
    `;
  }

  static get _fab_styles() {
    return css`
      ha-fab {
        position: sticky;
        float: right;
        right: calc(16px + env(safe-area-inset-right));
        bottom: calc(16px + env(safe-area-inset-bottom));
        z-index: 1;
      }
    `;
  }
}
