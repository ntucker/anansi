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

## TypeScript 7

ts-jest and the tsconfig reader need TypeScript's JS API, which 7.0 doesn't
ship. Keep 6.0 as `typescript` and add 7.0's `tsc` beside it:

```json
{
  "typescript": "npm:@typescript/typescript6@^6.0.2",
  "@typescript/native": "npm:typescript@^7.0.2"
}
```

ts-jest then type checks on 6.0 while `tsc` checks on 7.0, and the two can
disagree. Treat `tsc --noEmit` as the source of truth.
