import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('loose mode', function (hooks) {
  setupRenderingTest(hooks);

  test('components were compiled correctly', async function (assert) {
    await render(hbs`
      <TsDemo />
      <JsClassDemo />
    `);

    assert.dom().containsText('TS Demo: Hello World');
    assert.dom().containsText('JS Class Demo: Hello World');
  });
});
