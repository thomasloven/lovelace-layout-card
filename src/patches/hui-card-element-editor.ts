customElements.whenDefined("hui-card-element-editor").then(() => {
  const HuiCardElementEditor = customElements.get("hui-card-element-editor");

  const _getConfigElement = HuiCardElementEditor.prototype.getConfigElement;
  HuiCardElementEditor.prototype.getConfigElement = async function () {
    const retval = await _getConfigElement.bind(this)();

    if (retval) {
      const _setConfig = retval.setConfig;

      retval.setConfig = function (config: any) {
        let newConfig = JSON.parse(JSON.stringify(config));
        this._layoutData = newConfig.view_layout;

        delete newConfig.view_layout;

        _setConfig.bind(this)(newConfig);
      };
    }
    return retval;
  };

  const _handleUIConfigChanged =
    HuiCardElementEditor.prototype._handleUIConfigChanged;
  HuiCardElementEditor.prototype._handleUIConfigChanged = function (ev) {
    if (this._configElement && this._configElement._layoutData)
      ev.detail.config.view_layout = this._configElement._layoutData;
    _handleUIConfigChanged.bind(this)(ev);
  };
});
