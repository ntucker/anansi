---
"@anansi/eslint-plugin": patch
---

`import/order` keeps Yarn PnP packages in the external group. PnP resolves them under `.yarn` rather than `node_modules` (#3198).
