# rollup-plugin-glimmer-template-tag

Rollup plugin for providing `<template>` support for both gjs and gts file formats


## Usage

The first step is add the rollup plugin, which will
understand the `<template>` tag `gjs` and `gts` files:

```js
import { Addon } from '@embroider/addon-dev/rollup';
import templateTag from 'rollup-plugin-glimmer-template-tag';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist'
});

export default {
  output: addon.output(),
  plugins: [
    addon.publicEntrypoints(['components/**/*.js', 'index.js'<% if (typescript) {%>, 'template-registry.js'<% } %>]),
    addon.appReexports(['components/**/*.js']),
    addon.dependencies(),
    templateTag(),
    // ...
  ]
};
```

For `gjs` files, the next line would be to run the babel plugin, which uses the
config we extended earlier and transpiles the intermediate format into the final
`js` files.

### Configure `rollup-plugin-ts` (TS Only)

For typescript, a config change is required to allow the transpilation to happen:

```diff
// rollup.plugin.mjs
   
    typescript({
      transpiler: 'babel',
      browserslist: false,
-      transpileOnly: false,
+      transpileOnly: true,
    }),
```

Background: `rollup-plugin-ts` uses your input files (the intermediate format
from the step above) to typecheck them, which in our case will always error.
Telling `rollup-plugin-ts` to only transpile won't typecheck.
