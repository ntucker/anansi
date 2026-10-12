# Testing with @anansi/jest-preset

```js
// jest.config.js
module.exports = {
  preset: '@anansi/jest-preset',
  testEnvironment: 'jsdom', // for React components; default is node
  modulePaths: ['src'], // match webpack basePath for bare imports
};
```

The preset transforms TS/JS with the project's babel config and maps the same
asset, style, svg and worker imports as `@anansi/webpack-config`, so code that
builds also loads in tests. Don't add moduleNameMapper entries or transforms
for those.

`anansi add testing` adds this config, `@types/jest` and scripts:

```json
{
  "test": "NODE_ENV=test jest",
  "test:ci": "run test -- --ci",
  "test:watch": "run test -- --watch",
  "test:coverage": "run test -- --coverage"
}
```

## Env

Set these at the top of `jest.config.js` (jest presets can't take options):

- `ANANSI_JEST_TSCONFIG` (default `tsconfig.json`): use a test tsconfig such as
  `tsconfig.test.json`.
- `ANANSI_JEST_BABELCONFIG` (default `true`, auto-detect): exactly
  `babel.config.js` turns on `rootMode: 'upward'`, which monorepos usually
  need; any other value is used as the babel `configFile`.
- `ANANSI_JEST_TYPECHECK=false` skips type checking in jest to save memory;
  run `tsc --noEmit` separately so types are still checked once.

Linaria/wyw-in-js styles need `'@wyw-in-js'` in the babel presets for tests,
because webpack doesn't run under jest.
