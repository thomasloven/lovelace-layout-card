import {
  LitElement,
  html,
  property,
  internalProperty,
  CSSResultArray,
  css,
  query,
} from "lit-element";
import { LayoutCardConfig } from "./types";

class LayoutCardEditor extends LitElement {
  @property() _config: LayoutCardConfig;
  @property() lovelace;
  @property() hass;

  @internalProperty() _selectedTab = 0;
  @internalProperty() _selectedCard = 0;
  @internalProperty() _cardGUIMode = true;
  @internalProperty() _cardGUIModeAvailable = true;

  @query("hui-card-element-editor") _cardEditorEl?;

  setConfig(config) {
    this._config = config;
  }

  _handleSwitchTab(ev: CustomEvent) {
    this._selectedTab = parseInt(ev.detail.index, 10);
  }

  _layoutChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const type = ev.detail.config.type
      ? ev.detail.config.type
          .substr("custom:".length)
          .slice(0, -"-layout".length)
      : "default";

    this._config = { ...this._config };

    if (type !== "default") this._config.layout_type = type;
    else delete this._config.layout_type;

    if (ev.detail.config.layout) this._config.layout = ev.detail.config.layout;
    else delete this._config.layout;

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
    const type =
      this._config.layout_type && this._config.layout_type !== "default"
        ? `custom:${this._config.layout_type}-layout`
        : undefined;
    const layout = this._config.layout;

    return html`<div class="layout">
      <view-layout-editor
        .config=${{ type, layout }}
        @view-layout-changed=${this._layoutChanged}
      ></view-layout-editor>
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
