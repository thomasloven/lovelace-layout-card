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
  @property() badges: Array<HTMLElement> = [];
  // Set by Home Assistant (e.g. ["views", 0]); older versions only set index.
  @property() path?: Array<string | number>;
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

  _render_header() {
    const header = this._config?.header;
    const editMode = this.lovelace?.editMode ?? false;
    const viewPath = this.path ?? [this.index];

    // <hui-view-header> renders the view header card and the badges, with
    // the same editing as the sections view. It is part of the lazily
    // loaded sections view, so it may not be defined yet.
    if (customElements.get("hui-view-header")) {
      if (!header && !this.badges?.length && !editMode) return html``;
      return html`
        <hui-view-header
          .hass=${this.hass}
          .badges=${this.badges}
          .lovelace=${this.lovelace}
          .path=${viewPath}
          .config=${header}
        ></hui-view-header>
      `;
    }
    if (header || editMode) this._loadViewHeader();

    // <hui-view-badges> is part of the masonry view, which Home Assistant
    // always loads.
    if (!this.badges?.length && !editMode) return html``;
    return html`
      <hui-view-badges
        .badges=${this.badges}
        .lovelace=${this.lovelace}
        .path=${[...viewPath, "badges"]}
        show-add-label
      ></hui-view-badges>
    `;
  }

  static _viewHeaderRequested = false;
  _waitingForViewHeader = false;

  _loadViewHeader() {
    if (!this._waitingForViewHeader) {
      this._waitingForViewHeader = true;
      customElements
        .whenDefined("hui-view-header")
        .then(() => this.requestUpdate());
    }
    if (BaseLayout._viewHeaderRequested || !this.hass || !this.lovelace)
      return;
    BaseLayout._viewHeaderRequested = true;

    // Home Assistant has no public way to load the sections view. A hidden
    // sections <hui-view> makes it import that view, which defines
    // <hui-view-header>. The loader is removed again right after.
    const loader = document.createElement("hui-view") as any;
    loader.style.display = "none";
    loader.hass = this.hass;
    loader.lovelace = {
      ...this.lovelace,
      editMode: false,
      config: { views: [{ type: "sections", sections: [] }] },
    };
    loader.index = 0;
    document.body.appendChild(loader);
    const remove = () => loader.remove();
    customElements.whenDefined("hui-view-header").then(remove);
    setTimeout(remove, 30000);
  }

  static get _header_styles() {
    return css`
      hui-view-header {
        display: block;
        padding: 4px 8px 8px;
      }
      hui-view-badges {
        display: block;
        margin: 4px 8px 8px;
        font-size: var(--ha-font-size-s);
      }
    `;
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
        position: fixed;
        right: calc(16px + env(safe-area-inset-right));
        bottom: calc(16px + env(safe-area-inset-bottom));
        z-index: 1;
      }
    `;
  }
}
