# rollup-plugin-glimmer-template-tag

## 0.3.0

### Minor Changes

- [#11](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/pull/11) [`5938936`](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/commit/5938936d9d7471d1ab03e0dbe1ee9eba23f47634) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Add option to the rollup plugin so that folks can choose to separately due to the two-step transform.

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

## 0.2.0

### Minor Changes

- [#6](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/pull/6) [`fe9f110`](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/commit/fe9f110f2f6c6af6daa926ed4b9db32ec6fc2c3d) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - The entirety of the `<template>` transform is done in rollup.
  Now folks don't need to remember to configure babel _in addition_ to the existing needed rollup config.

## 0.1.0

### Minor Changes

- [#1](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/pull/1) [`123a136`](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/commit/123a136ff1d659fc40cf8d7f7f288faa26c2ece7) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Initial release
