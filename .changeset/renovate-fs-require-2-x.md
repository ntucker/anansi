---
'@anansi/core': patch
---

Update `fs-require` to ^2.0.0. Dev-server bundles resolve bare dependencies from the app, so a nested copy under `@anansi/core` does not replace the app's package.
