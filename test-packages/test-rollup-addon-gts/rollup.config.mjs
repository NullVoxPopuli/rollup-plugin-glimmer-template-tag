import { Addon } from '@embroider/addon-dev/rollup';

import typescript from 'rollup-plugin-ts';
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
    glimmerTemplateTag({ preprocessOnly: false }),
    typescript({
      transpiler: 'babel',
      // Babel defaults to "guessing" when there is no browserslist past
      // We want to do the least amount of work
      browserslist: ['last 1 firefox versions'],
      transpileOnly: true,
    }),
    addon.dependencies(),
    addon.clean(),
  ],
});
