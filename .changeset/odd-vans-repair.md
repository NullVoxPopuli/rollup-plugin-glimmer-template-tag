---
"rollup-plugin-glimmer-template-tag": minor
---

Add option to the rollup plugin so that folks can choose to separately due to the two-step transform.

In 0.2.0, it became possible to _only_ use the rollup plugin for the entirety of the transform, whereas in 0.1.0, a babel plugin was needed as well.

In this version, you may go back to the 0.1.0 style configuration via:

```js
// rollup.config.mjs
export default {
  output: addon.output(),
  plugins: [
    // ...
    glimmerTemplateTag({ preprocessOnly: true }),
    // ...
  ],
};
```
