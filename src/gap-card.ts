import { css, html, LitElement, property } from "lit-element";
class GapCard extends HTMLElement {
  height: number;
  size: number;

  setConfig(config) {
    this.height = config.height ?? 50;
    this.size = config.size ?? Math.ceil(this.height / 50);
    this.style.cssText = `
      display: block;
      height: ${this.height}px;
    `;
  }

  getCardSize() {
    return this.size;
  }

  static getConfigElement() {
    return document.createElement("gap-card-editor");
  }
  static getStubConfig() {
    return {};
  }
}

customElements.define("gap-card", GapCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "gap-card",
  name: "Gap Card",
  preview: false,
  description: "Add a customizable gap in the layout.",
});

class GapCardEditor extends LitElement {
  @property() _config;

  setConfig(config) {
    this._config = config;
  }

  heightChanged(ev) {
    const config = { ...this._config };
    delete config.height;
    if (ev.detail.value) config.height = parseInt(ev.detail.value);
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config } })
    );
  }

  sizeChanged(ev) {
    const config = { ...this._config };
    delete config.size;
    if (ev.detail.value) config.size = parseInt(ev.detail.value);
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config } })
    );
  }

  render() {
    return html`
      <paper-input
        .label=${"Height (px) (optional)"}
        type="number"
        .value=${this._config.height}
        @value-changed=${this.heightChanged}
      ></paper-input>
      <paper-input
        .label=${"Layout size (optional)"}
        type="number"
        .value=${this._config.size}
        @value-changed=${this.sizeChanged}
      ></paper-input>
    `;
  }
}

customElements.define("gap-card-editor", GapCardEditor);
