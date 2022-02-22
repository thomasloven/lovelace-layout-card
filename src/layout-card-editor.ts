import { LitElement, html, CSSResultArray, css } from "lit";
import { property, state, query } from "lit/decorators.js";
import { LayoutCardConfig } from "./types";
import { loadHaYamlEditor } from "./helpers";

const CUSTOM_LAYOUT_TYPES = ["masonry", "horizontal", "vertical", "grid"];

class LayoutCardEditor extends LitElement {
  @property() _config: LayoutCardConfig;
  @property() lovelace;
  @property() hass;

  @state() _selectedTab = 0;
  @state() _selectedCard = 0;
  @state() _cardGUIMode = true;
  @state() _cardGUIModeAvailable = true;

  @query("hui-card-element-editor") _cardEditorEl?;

  setConfig(config) {
    this._config = config;
  }

  firstUpdated() {
    loadHaYamlEditor();
  }

  _handleSwitchTab(ev: CustomEvent) {
    this._selectedTab = parseInt(ev.detail.index, 10);
  }

  _layoutChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const target: any = ev.target;
    this._config = { ...this._config };
    if (target.id === "layout_type") {
      if (target.value === "default") {
        delete this._config.layout_type;
      } else {
        this._config.layout_type = target.value;
      }
    }
    if (target.id === "layout") {
      this._config.layout = target.value;
    }
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: this._config } })
    );
  }

  _editCard(ev) {
    ev.stopPropagation();
    if (ev.target.id === "add-card") {
      this._selectedCard = this._config.cards.length;
      return;
    }
    this._cardGUIMode = true;
    if (this._cardEditorEl) this._cardEditorEl.GUImode = true;
    this._cardGUIModeAvailable = true;
    this._selectedCard = parseInt(ev.detail.selected, 10);
  }
  _addCard(ev: CustomEvent) {
    ev.stopPropagation();
    const cards = [...this._config.cards];
    cards.push(ev.detail.config);
    this._config = { ...this._config, cards };
    this._selectedCard = this._config.cards.length - 1;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: this._config } })
    );
  }
  _updateCard(ev) {
    ev.stopPropagation();
    const cards = [...this._config.cards];
    cards[this._selectedCard] = ev.detail.config;
    this._config = { ...this._config, cards };
    this._cardGUIModeAvailable = ev.detail.guiModeAvailable;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: this._config } })
    );
  }
  _GUIModeChange(ev) {
    ev.stopPropagation();
    this._cardGUIMode = ev.detail.guiMode;
    this._cardGUIModeAvailable = ev.detail.guiModeAvailable;
  }
  _toggleMode(ev) {
    this._cardEditorEl.toggleMode();
  }
  _moveCard(ev) {
    const source = this._selectedCard;
    const target = source + ev.currentTarget.move;
    const cards = [...this._config.cards];
    const card = cards.splice(source, 1)[0];
    cards.splice(target, 0, card);
    this._config = { ...this._config, cards };
    this._selectedCard = target;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: this._config } })
    );
  }
  _deleteCard() {
    const cards = [...this._config.cards];
    cards.splice(this._selectedCard, 1);
    this._config = { ...this._config, cards };
    this._selectedCard = Math.max(0, this._selectedCard - 1);
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: this._config } })
    );
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="toolbar">
          <mwc-tab-bar
            .activeIndex=${this._selectedTab}
            @MDCTabBar:activated=${this._handleSwitchTab}
          >
            <mwc-tab .label=${"Layout"}></mwc-tab>
            <mwc-tab .label=${"Cards"}></mwc-tab>
          </mwc-tab-bar>
        </div>
        <div id="editor">
          ${[this._renderLayoutEditor, this._renderCardsEditor][
            this._selectedTab
          ].bind(this)()}
        </div>
      </div>
    `;
  }

  _renderLayoutEditor() {
    return html`<div class="layout">
      <mwc-select
        .label=${this.hass.localize("ui.panel.lovelace.editor.edit_view.type")}
        .value=${this._config.layout_type || "default"}
        @selected=${this._layoutChanged}
        @closed=${(ev) => ev.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
        id="layout_type"
      >
        <mwc-list-item .value=${"default"}>
          ${this.hass.localize(
            `ui.panel.lovelace.editor.edit_view.types.masonry`
          )}
        </mwc-list-item>
        ${CUSTOM_LAYOUT_TYPES.map(
          (type) => html`<mwc-list-item .value=${`custom:${type}-layout`}>
            ${type} (layout-card)
          </mwc-list-item>`
        )}
      </mwc-select>
      <ha-yaml-editor
        id="layout"
        .label=${"Layout options"}
        .defaultValue=${this._config.layout ?? ""}
        @value-changed=${this._layoutChanged}
      >
      </ha-yaml-editor>
    </div>`;
  }

  _renderCardsEditor() {
    const selected = this._selectedCard;
    const numcards = this._config.cards.length;
    if (this._config.entities) {
      return html`
        This layout-card has the <code>entities</code> parameter set. You cannot
        manually select cards.
      `;
    }
    return html`
      <div class="cards">
        <div class="toolbar">
          <paper-tabs
            scrollable
            .selected=${selected}
            @iron-activate=${this._editCard}
          >
            ${this._config.cards.map((_card, i) => {
              return html` <paper-tab> ${i + 1} </paper-tab> `;
            })}
          </paper-tabs>
          <paper-tabs
            id="add-card"
            .selected=${selected == numcards ? "0" : undefined}
            @iron-activate=${this._editCard}
          >
            <paper-tab>
              <ha-icon .icon=${"mdi:plus"}></ha-icon>
            </paper-tab>
          </paper-tabs>
        </div>
        <div id="editor">
          ${selected < numcards
            ? html`
                <div class="card-options">
                  <mwc-button
                    @click=${this._toggleMode}
                    .disabled=${!this._cardGUIModeAvailable}
                    class="gui-mode-button"
                  >
                    ${this.hass.localize(
                      this._cardEditorEl || this._cardGUIMode
                        ? "ui.panel.lovelace.editor.edit_card.show_code_editor"
                        : "ui.panel.lovelace.editor.edit_card.show_visual_editor"
                    )}
                  </mwc-button>
                  <mwc-icon-button
                    .disabled=${selected === 0}
                    @click=${this._moveCard}
                    .move=${-1}
                  >
                    <ha-icon .icon=${"mdi:arrow-left"}></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button
                    .disabled=${selected === numcards - 1}
                    @click=${this._moveCard}
                    .move=${1}
                  >
                    <ha-icon .icon=${"mdi:arrow-right"}></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button @click=${this._deleteCard}>
                    <ha-icon .icon=${"mdi:delete"}></ha-icon>
                  </mwc-icon-button>
                </div>
                <hui-card-element-editor
                  .hass=${this.hass}
                  .value=${this._config.cards[selected]}
                  .lovelace=${this.lovelace}
                  @config-changed=${this._updateCard}
                  @GUImode-changed=${this._GUIModeChange}
                ></hui-card-element-editor>
              `
            : html`
                <hui-card-picker
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  @config-changed=${this._addCard}
                ></hui-card-picker>
              `}
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultArray {
    return [
      css`
        mwc-tab-bar {
          border-bottom: 1px solid var(--divider-color);
        }

        .layout,
        .cards #editor {
          margin-top: 8px;
          border: 1px solid var(--divider-color);
          padding: 12px;
        }

        .cards .toolbar {
          display: flex;
          --paper-tabs-selection-bar-color: var(--primary-color);
          --paper-tab-ink: var(--primary-color);
        }
        paper-tabs {
          display: flex;
          font-size: 14px;
          flex-grow: 1;
        }
        #add-card {
          max-width: 32px;
          padding: 0;
        }

        .cards .card-options {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }
        #editor {
          border: 1px solid var(--divider-color);
          padding: 12px;
        }
        .gui-mode-button {
          margin-right: auto;
        }
      `,
    ];
  }
}

customElements.define("layout-card-editor", LayoutCardEditor);
