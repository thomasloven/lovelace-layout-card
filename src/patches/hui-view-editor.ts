import { LAYOUT_CARD_SELECTOR_OPTIONS } from "../helpers";

customElements.whenDefined("hui-view-editor").then(() => {
  const HuiViewEditor = customElements.get("hui-view-editor");

  const firstUpdated = HuiViewEditor.prototype.firstUpdated;
  HuiViewEditor.prototype.firstUpdated = function () {
    firstUpdated?.bind(this)();

    this._oldSchema = this._schema;
    this._schema = (localize) => {
      const retval = this._oldSchema(localize);
      const typeSelector = retval[retval.length - 1];
      if (typeSelector.name === "layout") return retval;
      typeSelector.selector.select.options.push(
        ...LAYOUT_CARD_SELECTOR_OPTIONS
      );
      retval.push({
        name: "layout",
        selector: { object: {} },
      });
      return retval;
    };

    this.requestUpdate();
  };
});
