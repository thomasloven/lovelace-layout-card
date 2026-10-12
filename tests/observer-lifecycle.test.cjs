const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const test = require('node:test');
const ts = require('typescript');

// Keep the real layout classes; stub only the DOM/Lit boundary for this lifecycle race.
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
global.ResizeObserver = class {
  constructor(callback) { this.callback = callback; this.disconnects = 0; }
  disconnect() { this.disconnects++; }
};
const { BaseColumnLayout } = require('../src/layouts/base-column-layout.ts');

test('can detach while setConfig is awaiting the base configuration', async () => {
  const layout = new BaseColumnLayout();
  const configuring = layout.setConfig({ cards: [] });
  assert.doesNotThrow(() => layout.disconnectedCallback());
  await configuring;
});

test('can request an early layout before the observer setup continuation', async () => {
  const layout = new BaseColumnLayout();
  const configuring = layout.setConfig({ cards: [] });
  // Columns have not been measured yet; the early request should be harmless.
  await assert.doesNotReject(layout._makeColumnLayout());
  await configuring;
});

test('still disconnects and responds to resize after configuration', async () => {
  const layout = new BaseColumnLayout();
  await layout.setConfig({ cards: [], layout: { width: 100 } });
  const observer = layout._observer;
  const previous = observer.disconnects;
  layout.disconnectedCallback();
  assert.equal(observer.disconnects, previous + 1);
  observer.callback();
  assert.equal(layout._columns, 3);
});
