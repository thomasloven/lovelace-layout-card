const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const test = require('node:test');
const ts = require('typescript');

// Exercise real card creation and rebuild paths with a minimal DOM/Lit boundary.
class LitElement {
  disconnectedCallback() {}
  getBoundingClientRect() { return { width: 300 }; }
}
const load = Module._load;
Module._load = function (id, ...args) {
  if (id === 'lit') return { LitElement, css() {}, html() {} };
  if (id === 'lit/decorators.js') return { property: () => () => {} };
  return load.call(this, id, ...args);
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      experimentalDecorators: true, useDefineForClassFields: false },
  }).outputText, filename);
};
let LayoutCard;
global.customElements = { define(name, cls) { if (name === 'layout-card') LayoutCard = cls; } };
global.window = {};
require('../src/layout-card.ts');
function helpers() {
  return { createCardElement(config) { return { config, addEventListener(name, fn) { this[name] = fn; } }; } };
}
test('passes visibility to native conditional evaluation without changing configuration', () => {
  const card = new LayoutCard(); card.hass = { states: {} };
  const config = { type: 'markdown', content: 'hidden', visibility: [{ condition: 'state', entity: 'input_boolean.test', state: 'on' }] };
  const original = JSON.stringify(config);
  const el = card._createCard(config, helpers());
  assert.equal(el.config.type, 'conditional');
  assert.deepEqual(el.config.conditions, config.visibility);
  assert.equal(el.config.card, config);
  assert.equal(el.hass, card.hass);
  assert.equal(JSON.stringify(config), original);
});
test('cards without visibility keep their original element and config', () => {
  const card = new LayoutCard();
  for (const visibility of [undefined, []]) {
    const config = { type: 'markdown', visibility };
    assert.equal(card._createCard(config, helpers()).config, config);
  }
});
test('rebuilding a hidden card creates only one conditional wrapper', async () => {
  const card = new LayoutCard(); const factory = helpers(); window.loadCardHelpers = async () => factory;
  const config = { type: 'markdown', visibility: [{ condition: 'state', entity: 'input_boolean.test', state: 'on' }] };
  const old = card._createCard(config, factory); card._cards = [old];
  await card._rebuildCard(old, config);
  assert.equal(card._cards[0].config.type, 'conditional');
  assert.equal(card._cards[0].config.card.type, 'markdown');
});
