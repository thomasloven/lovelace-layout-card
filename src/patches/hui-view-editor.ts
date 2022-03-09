import { loadHaYamlEditor } from "../helpers";
const LAYOUT_TYPES = ["masonry", "horizontal", "vertical", "grid"];

customElements.whenDefined("hui-view-editor").then(() => {
  const HuiViewEditor = customElements.get("hui-view-editor");

  const firstUpdated = HuiViewEditor.prototype.firstUpdated;
  HuiViewEditor.prototype.firstUpdated = function () {
    firstUpdated?.bind(this)();

    this._oldSchema = this._schema;
    this._schema = (localize) => {
      const retval = this._oldSchema(localize);
      const typeSelector = retval[retval.length - 1];
      typeSelector.selector.select.options.push({
        value: "custom:masonry-layout",
        label: "Masonry (layout-card)",
      });
      typeSelector.selector.select.options.push({
        value: "custom:horizontal-layout",
        label: "Horizontal (layout-card)",
      });
      typeSelector.selector.select.options.push({
        value: "custom:vertical-layout",
        label: "Vertical (layout-card)",
      });
      typeSelector.selector.select.options.push({
        value: "custom:grid-layout",
        label: "Grid (layout-card)",
      });
      console.log(retval, typeSelector);
      retval.push({
        name: "layout",
        selector: { object: {} },
      });
      return retval;
    };

    this.requestUpdate();
  };
});
