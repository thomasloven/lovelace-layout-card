import { loadHaYamlEditor } from "../helpers";
const LAYOUT_TYPES = ["masonry", "horizontal", "vertical", "grid"];

customElements.whenDefined("hui-view-editor").then(() => {
  const HuiViewEditor = customElements.get("hui-view-editor");

  loadHaYamlEditor();

  const firstUpdated = HuiViewEditor.prototype.firstUpdated;
  HuiViewEditor.prototype.firstUpdated = function () {
    firstUpdated?.bind(this)();

    const listBox = this.shadowRoot.querySelector("mwc-select");
    if (!listBox || listBox.layoutCardPatch) return;

    LAYOUT_TYPES.forEach((type) => {
      const el = document.createElement("mwc-list-item");
      (el as any).value = `custom:${type}-layout`;
      el.innerHTML = `${type} (layout-card)`;
      listBox.appendChild(el);
    });
    listBox.layoutCardPatched = true;

    const layoutEditor = document.createElement("ha-yaml-editor");
    (layoutEditor as any).label = "Layout options";
    (layoutEditor as any).defaultValue = this._config.layout ?? "";
    layoutEditor.addEventListener("value-changed", (ev: CustomEvent) => {
      ev.stopPropagation();
      const newConfig = { ...this._config };
      newConfig.layout = ev.detail.value;
      this.dispatchEvent(
        new CustomEvent("view-config-changed", {
          detail: { config: newConfig },
        })
      );
    });

    this.shadowRoot.appendChild(layoutEditor);
  };

  const updated = HuiViewEditor.prototype.updated;
  HuiViewEditor.prototype.updated = function (_changedProperties) {
    updated?.bind(this)(_changedProperties);

    if (_changedProperties.has("_config")) {
      const layoutEditor = this.shadowRoot.querySelector("ha-yaml-editor");
      if (!layoutEditor) return;
      (layoutEditor as any).defaultValue = this._config.layout;
    }
  };
});
