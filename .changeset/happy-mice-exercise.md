---
"rollup-plugin-glimmer-template-tag": patch
---

Fixes an issue where files were resolved out-of-band from rollup's built-in resolve infrastructure.

Using rollup's resolve infrastructure gives great cache and memoization benefits,
so not using it caused up to 10x slow down in some other addons that also needed to resolve non-standing modules.

This was initially discovered and reported here: https://github.com/embroider-build/embroider/pull/1413
And the original perf accident was propagated from here: https://github.com/dfreeman/fccts-in-v2/blob/main/fcct-support/rollup-plugin.js#L15
It went unnoticed until rollup-plugin-glimmer-template-tag was used in an addon with over 500 files during an ember addon to native package conversion.

Thanks to AuditBoard for discovering this performance problem, and to [@ef4](https://github.com/ef4/) for helping out with explaining how rollup works.
