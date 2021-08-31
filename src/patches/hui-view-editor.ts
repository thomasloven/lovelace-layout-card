import { LitElement, html } from "lit-element";

const LAYOUT_TYPES = ["masonry", "horizontal", "vertical", "grid"];

customElements.whenDefined("hui-view-editor").then(() => {
  const HuiViewEditor = customElements.get("hui-view-editor");

  (async () => {
    // Load in ha-yaml-editor from developer-tools-service
    const ppResolver = document.createElement("partial-panel-resolver");
    const routes = (ppResolver as any).getRoutes([
      {
        component_name: "developer-tools",
        url_path: "a",
      },
    ]);
    await routes?.routes?.a?.load?.();
    const devToolsRouter = document.createElement("developer-tools-router");
    await (devToolsRouter as any)?.routerOptions?.routes?.service?.load?.();
  })();

  const firstUpdated = HuiViewEditor.prototype.firstUpdated;
  HuiViewEditor.prototype.firstUpdated = function () {
    firstUpdated?.bind(this)();

    const listBox = this.shadowRoot.querySelector(
      "paper-listbox[attr-for-selected=type]"
    );
    if (!listBox || listBox.layoutCardPatch) return;

    LAYOUT_TYPES.forEach((type) => {
      const el = document.createElement("paper-item");
      (el as any).type = `custom:${type}-layout`;
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
      if (layoutEditor) return;
      (layoutEditor as any).defaultValue = this._config.layout;
    }
  };
});
