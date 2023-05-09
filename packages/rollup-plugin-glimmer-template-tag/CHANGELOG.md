# rollup-plugin-glimmer-template-tag

## 0.4.1

### Patch Changes

- [#24](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/pull/24) [`1dd4939`](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/commit/1dd493960cdbb21945f90b2a6d1edf30b8742572) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fixes an issue where files were resolved out-of-band from rollup's built-in resolve infrastructure.

  Using rollup's resolve infrastructure gives great cache and memoization benefits,
  so not using it caused up to 10x slow down in some other addons that also needed to resolve non-standing modules.

  This was initially discovered and reported here: https://github.com/embroider-build/embroider/pull/1413
  And the original perf accident was propagated from here: https://github.com/dfreeman/fccts-in-v2/blob/main/fcct-support/rollup-plugin.js#L15
  It went unnoticed until rollup-plugin-glimmer-template-tag was used in an addon with over 500 files during an ember addon to native package conversion.

  Thanks to AuditBoard for discovering this performance problem, and to [@ef4](https://github.com/ef4/) for helping out with explaining how rollup works.

## 0.4.0

### Minor Changes

- [#15](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/pull/15) [`bf84978`](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/commit/bf849789046c8283d77d937c1cb0a467398694c1) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Invert (again) the 2-phase behavior. preprocessOnly will be try by default, and it can be set to false if you want single-file-configuration (at the cost of double babel parse). README has been updated accordingly

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
