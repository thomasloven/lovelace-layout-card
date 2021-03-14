class LayoutBreak extends HTMLElement {
  _display;
  setConfig() {
    this.style.display = "none";
    const display = document.createElement("ha-card");
    display.innerHTML = "BREAK";
    display.style.cssText = `
      background: red;
      text-align: center;
      font-size: large;
      color: white;
      padding: 16px;
      `;
    this.appendChild(display);
  }
  getCardSize() {
    return 0;
  }
  set editMode(editMode) {
    this.style.display = editMode ? "block" : "none";
  }

  static getConfigElement() {
    return document.createElement("layout-break-editor");
  }
  static getStubConfig() {
    return {};
  }
}

customElements.define("layout-break", LayoutBreak);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "layout-break",
  name: "Layout Break",
  preview: false,
  description:
    "Forces a break in the layout flow. For use with layout-card or special layouts.",
});

class LayoutBreakEditor extends HTMLElement {
  setConfig(config) {
    const div = document.createElement("div");
    div.innerHTML = "BREAK";
    this.appendChild(div);
  }
}

customElements.define("layout-break-editor", LayoutBreakEditor);
