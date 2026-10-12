# Libraries with @anansi/babel-preset

```js
// babel.config.js (or .babelrc.js)
module.exports = {
  presets: ['@anansi'], // or [['@anansi', { ...options }]]
  assumptions: { noDocumentAll: true, noClassCalls: true, pureGetters: true },
};
```

The preset is Babel 8-first, handles TypeScript by stripping types (run `tsc`
separately for `.d.ts` and type checking), and reads its caller to pick
defaults:

- Default `polyfillMethod`, in order:
  - App builds with `core-js` installed: `usage-pure` if package.json lists
    `core-js-pure` but not `core-js`, else `usage-global`, or `entry-global`
    without `@babel/runtime`.
  - Library builds (`@babel/cli`, `@rollup/plugin-babel`, or caller
    `library: true`) and apps without `core-js`: `usage-pure` (never touches
    globals) when `core-js-pure` and `@babel/runtime-corejs3` are installed,
    else no polyfills.
- webpack `--target=node` and jest target the current node.

## Options agents reach for

- `polyfillMethod: 'usage-pure' | 'usage-global' | 'entry-global' | false`
  (prefer over the deprecated `useBuiltIns`). `polyfillTargets` (or
  `POLYFILL_TARGETS`) narrows which polyfills ship without changing syntax
  transforms.
- `modules: false | 'commonjs' | 'auto'`, or `BABEL_MODULES` env. Default keeps
  ESM when the caller supports it.
- Targets: use top-level `targets` or a browserslist config
  (`extends @anansi/browserslist-config`). `nodeTarget` and preset-level
  `targets` are deprecated.
- `loose: true` turns on a broad set of top-level `assumptions` (spread,
  rest, class fields, template objects and more). Prefer listing the
  `assumptions` you want.
- `reactCompiler: {}` enables React Compiler in production (React 19+).
- `hasJsxRuntime` defaults to true; set false only for React <=16.13.
- Imports: `tsConfigPath` applies tsconfig `paths`; `resolverRoot`,
  `resolverAlias` and `resolver` configure module-resolver; `~/` maps to
  `./src` (`rootPathSuffix`, `rootPathPrefix`).
- `decoratorsOptions.version` defaults to `2023-11`.

## Build scripts

```json
{
  "scripts": {
    "build:lib": "NODE_ENV=production babel src --out-dir lib --extensions '.ts,.tsx,.js' --ignore '**/__tests__/**' --ignore '**/*.d.ts'",
    "build:types": "tsc --build",
    "build:bundle": "rollup -c",
    "build": "run build:lib && run build:types"
  }
}
```

Bundle with rollup through `@rollup/plugin-babel` so the preset detects a
library build. Mark `dependencies` and `peerDependencies` external, keep
`sideEffects: false` accurate, and include the env vars the config reads in
`api.cache.using(...)` when the babel config is a function.

`anansi hatch` with the library option scaffolds this layout.
