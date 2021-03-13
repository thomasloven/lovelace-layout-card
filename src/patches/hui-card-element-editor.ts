customElements.whenDefined("hui-card-element-editor").then(() => {
  const HuiCardElementEditor = customElements.get("hui-card-element-editor");

  const _getConfigElement = HuiCardElementEditor.prototype.getConfigElement;
  HuiCardElementEditor.prototype.getConfigElement = async function () {
    const retval = await _getConfigElement.bind(this)();

    if (retval) {
      const _setConfig = retval.setConfig;
      retval.setConfig = function (config: any) {
        const newConfig = JSON.parse(JSON.stringify(config));
        const layout = newConfig.layout;

        delete newConfig.layout;

        _setConfig.bind(this)(newConfig);

        if (layout) newConfig.layout = layout;
      };
    }
    return retval;
  };
});
