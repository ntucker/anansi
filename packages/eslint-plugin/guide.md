# Linting with @anansi/eslint-plugin

Flat config only, on ESLint 10. The exported configs are arrays, so spread them:

```js
// eslint.config.mjs
import anansiPlugin from '@anansi/eslint-plugin';
import globals from 'globals';

export default [
  ...anansiPlugin.configs.typescript, // or .javascript for JS-only projects
  { languageOptions: { globals: { ...globals.browser } } },
  { ignores: ['dist', 'lib', 'generated_assets', 'server_assets'] },
];
```

## Rules

- Add project rules in later config objects instead of editing or copying the
  plugin's; later objects win.
- Prettier runs as the `prettier/prettier` lint rule, so formatting problems
  show up as lint errors. Fix them with `eslint --fix` (or prettier) rather
  than disabling the rule or adding stylistic rules that fight it.

## TypeScript 7

typescript-eslint needs TypeScript's JS API, which 7.0 doesn't ship. Keep 6.0
as `typescript` and add 7.0's `tsc` beside it:

```json
{
  "typescript": "npm:@typescript/typescript6@^6.0.2",
  "@typescript/native": "npm:typescript@^7.0.2"
}
```
