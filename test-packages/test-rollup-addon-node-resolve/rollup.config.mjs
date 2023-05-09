import { Addon } from '@embroider/addon-dev/rollup';

import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
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
		babel({
			babelHelpers: 'bundled',
			extensions: ['.js', '.ts', '.gjs', '.gts'],
		}),
		nodeResolve({ extensions: ['.js', '.ts', '.gjs', '.gts'] }),
    addon.dependencies(),
    addon.clean(),
  ],
});
