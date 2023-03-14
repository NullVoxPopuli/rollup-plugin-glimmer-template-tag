# rollup-plugin-glimmer-template-tag

Rollup plugin for providing `<template>` support for both gjs and gts file formats

## Compatibility

- Node 16, 18, following Node's [LTS support](https://nodejs.dev/en/about/releases/).
- Rollup 3+
- ESM only. 
  Rollup configs will need to be in a type=module package, or be defined as `mjs` 


## Usage

First and foremost, this repo's test-packages contain examples of 
- js ember v2 addon using gjs 
- ts ember v2 addon using gts  
- ember test app consuming both of the above addons 

For specifics, the `packages/**` folder may provide value.


### Rollup


The first step is add the rollup plugin, which will
understand the `<template>` tag `gjs` and `gts` files:

```js
import { Addon } from '@embroider/addon-dev/rollup';

import { glimmerTemplateTag } from 'rollup-plugin-glimmer-template-tag';

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
    glimmerTemplateTag(),
    // ...
  ]
};
```

For `gjs` files, the next line would be to run the babel plugin, which uses the
config we extended earlier and transpiles the intermediate format into the final
`js` files.

### Babel

Add the `ember-template-imports` babel plugin to your babel config:

```diff
 'use strict';

 module.exports = {
   plugins: [
+    'ember-template-imports/src/babel-plugin',
     '@embroider/addon-dev/template-colocation-plugin',
     ['@babel/plugin-proposal-decorators', { legacy: true }],
     '@babel/plugin-proposal-class-properties'
   ]
 };
```


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
