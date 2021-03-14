import { LitElement, html } from "lit-element";

customElements.whenDefined("hui-dialog-edit-view").then(() => {
  const HuiDialogEditView = customElements.get("hui-dialog-edit-view");

  {
    // Load in ha-yaml-editor
    const loader = document.createElement("hui-masonry-view");
    (loader as any).lovelace = { editMode: true };
    (loader as any).updated(new Map());
  }

  const updated = HuiDialogEditView.prototype.firstUpdated;
  HuiDialogEditView.prototype.updated = function (changedProperties) {
    updated?.bind(this)(changedProperties);

    if (
      changedProperties.has("_params") &&
      changedProperties.get("_params") === undefined
    ) {
      const layoutTab = document.createElement("paper-tab");
      layoutTab.id = "tab-layout";
      layoutTab.innerHTML = "Layout";
      this.shadowRoot.querySelector("paper-tabs").appendChild(layoutTab);
    }

    if (changedProperties.has("_curTab")) {
      if (this._curTab === "tab-layout") {
        const layoutEditor = document.createElement("view-layout-editor");
        (layoutEditor as any).config = this._config;
        layoutEditor.addEventListener(
          "view-layout-changed",
          this._viewConfigChanged.bind(this)
        );
        const heading = this.shadowRoot.querySelector("div[slot='heading']");
        heading?.parentNode?.insertBefore(layoutEditor, heading.nextSibling);
      } else {
        const layoutEditor = this.shadowRoot.querySelector(
          "view-layout-editor"
        );
        layoutEditor?.parentNode?.removeChild(layoutEditor);
      }
    }
    if (
      changedProperties.has("_config") &&
      this.shadowRoot.querySelector("view-layout-editor")
    ) {
      (this.shadowRoot.querySelector(
        "view-layout-editor"
      ) as any).config = this._config;
    }
  };
});

const TYPE_OPTIONS = ["default", "masonry", "horizontal", "vertical", "grid"];

class ViewLayoutEditor extends LitElement {
  config;

  _typeChanged(ev) {
    ev.stopPropagation();
    const newType = TYPE_OPTIONS[ev.target.selected];
    this.config = { ...this.config };
    if (newType === "default") {
      delete this.config.type;
    } else {
      this.config.type = `custom:${newType}-layout`;
    }
    this.dispatchEvent(
      new CustomEvent("view-layout-changed", {
        detail: { config: this.config },
      })
    );
  }
  _layoutChanged(ev) {
    ev.stopPropagation();
    this.config = { ...this.config };
    this.config.layout = ev.detail.value;
    this.dispatchEvent(
      new CustomEvent("view-layout-changed", {
        detail: { config: this.config },
      })
    );
  }

  render() {
    const type = this.config.type
      ? this.config.type.substr("custom:".length).slice(0, -"-layout".length)
      : "default";

    return html`
      <paper-dropdown-menu .label=${"Layout type"}>
        <paper-listbox
          .selected=${TYPE_OPTIONS.indexOf(type)}
          slot="dropdown-content"
          @selected-item-changed=${this._typeChanged}
        >
          ${TYPE_OPTIONS.map(
            (option) => html` <paper-item>${option}</paper-item> `
          )}
        </paper-listbox>
      </paper-dropdown-menu>
      <ha-yaml-editor
        .label=${"Layout options"}
        .defaultValue=${this.config.layout ?? ""}
        @value-changed=${this._layoutChanged}
      >
      </ha-yaml-editor>
    `;
  }
}

customElements.define("view-layout-editor", ViewLayoutEditor);
