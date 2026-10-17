---
"@anansi/eslint-plugin": patch
"@anansi/jest-preset": patch
"@anansi/webpack-config": patch
---

Yarn PnP installs can load these presets. The ESLint plugin passes import resolvers by path, the Jest preset uses Jest's resolver and declares `core-js` and `jest-util`, and the webpack node target externalizes the package's own declared dependencies (#3197).
