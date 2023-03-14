import { Addon } from '@embroider/addon-dev/rollup';

import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'rollup';
import { glimmerTemplateTag } from 'rollup-plugin-glimmer-template-tag';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default defineConfig({
  output: addon.output(),
  plugins: [
    addon.publicEntrypoints(['**/*.js']),
    addon.appReexports(['components/**/*.js']),
    glimmerTemplateTag(),
    babel({ babelHelpers: 'bundled' }),
    addon.dependencies(),
    addon.clean(),
  ],
});
