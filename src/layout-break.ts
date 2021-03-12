class LayoutBreak extends HTMLElement {
  setConfig() {
    this.style.display = "none";
  }
  getCardSize() {
    return 0;
  }
}

customElements.define("layout-break", LayoutBreak);
