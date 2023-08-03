# No longer needed!!

`@embroider/addon-dev` (v4+) now ships with gjs/gts support 🥳

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

To use `<template>`, you need to change two files:
 - rollup.config.mjs (where this plugin is used)
 - babel.config.js / json / etc (where the `<template>` transform is finished)

### Rollup

The first step is add the rollup plugin, which will
understand the `<template>` tag `gjs` and `gts` files:

```diff
 // rollup.config.mjs
 import { Addon } from '@embroider/addon-dev/rollup';

+ import { glimmerTemplateTag } from 'rollup-plugin-glimmer-template-tag';

 const addon = new Addon({
   srcDir: 'src',
   destDir: 'dist'
 });

 export default {
   output: addon.output(),
   plugins: [
     addon.publicEntrypoints(['components/demo.js']),
     addon.appReexports(['components/**/*.js']),
     addon.dependencies(),
+    glimmerTemplateTag(),
     // ...
   ]
 };
```

### Babel 

```diff
 // babel.config.js / json / etc
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

Since you want only the _source files_ to be type-checked, it's best to use a `lint:types`
script for type checking, and pre-publish checking both locally and in your C.I. environment.
This repo is an example of how to set that up if this is unfamiliar.
```
"lint:types": "glint"
```

When using this method of type checking, the line numbers in errors will continue to match up.

#### Without type errors blocking the addon's build? what happens with the generated type declarations?

The errors are copied in to the type declaration files so that consumers would be alerted to the type errors.
For example, given this component where we forget to import the type for the `RouterService`:
```ts 
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class TsClassDemo extends Component {
  @service declare router: RouterService;

  greeting = 'Hello World!';

  <template>
    TS Class Demo: {{this.greeting}}
  </template>
}
```

The generated declaration for for this component is:
```ts
// dist/components/ts-class-demo.d.ts
import Component from '@glimmer/component';
declare class TsClassDemo extends Component {
    router: RouterService;
    greeting: string;
}
export { TsClassDemo as default };
```
which _also_ excludes the type for `RouterService`. 
If an addon is using a test-app for its tests and that test-app has typescript, the test-app will report a type error when trying to resolve the type of `TsClassDemo`.


#### What about `transpileOnly: false`?

Without setting `transpileOnly: true` (using the default or explicitly setting to `false`), 

- line number-errors will not match up as the input to rollup-plugin-ts is the output from the `<template>` transformation.

- you'll receive errors like the following

    ```
    [!] (plugin Typescript) RollupError: Cannot find module '@ember/template-compilation' or its corresponding type declarations.
    src/components/ts-class-demo.ts (2:36)

    2 import { precompileTemplate } from "@ember/template-compilation";
                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ```
    This exposes internal information about the `<template>` transformation process. 
    Though, you could try to get around the issue if you _really_ want `transpileOnly: false` by `declare module`ing for `@ember/template-compilation` in your `unpublished-development-types` _except_ that `@ember/template-compilation` is not presently a real package, so the part of the error saying `Cannot find module ` is still true, even though a corresponding type declaration is defined -- both the module and the type declarations are needed.


### Manually choosing the single-stage transformation

There is an option available to the rollup plugin so that folks can choose to attempt the full `<template>` transform in a single pass.

This would do both steps wholly within the rollup plugin:
 1. preprocess the `<template>` tag into a secret internal format
 2. convert that secret internal format into vanilla JS that a consuming build environment knows how to handle

However, for performance or compatibility reasons, it may not be desireable to allow both steps to be handled automatically -- babel will have to re-parse all your code again (for example, in `rollup-plugin-ts`).

If you want to try out a rollup-only `<template>` transform, you'll want to want these changes to your config files:

```diff
// rollup.config.mjs
 export default {
   output: addon.output(),
   plugins: [
     // ...
-    glimmerTemplateTag(),
+    glimmerTemplateTag({ preprocessOnly: false }),
     // ...
   ],
 };
```

```diff
 // babel.config.js / json / etc
 'use strict';
 module.exports = {
   plugins: [
-    'ember-template-imports/src/babel-plugin',
     '@embroider/addon-dev/template-colocation-plugin',
     ['@babel/plugin-proposal-decorators', { legacy: true }],
     '@babel/plugin-proposal-class-properties'
   ]
 };
```

