# Libraries with @anansi/babel-preset

```js
// babel.config.js (or .babelrc.js)
module.exports = {
  presets: [
    [
      '@anansi',
      {
        /* options */
      },
    ],
  ],
  assumptions: { noDocumentAll: true, noClassCalls: true, pureGetters: true },
};
```

The preset is Babel 8-first, handles TypeScript by stripping types (run `tsc`
separately for `.d.ts` and type checking), and reads its caller to pick
defaults:

- Library build (`@babel/cli`, `@rollup/plugin-babel`, or caller
  `library: true`): polyfills default to `usage-pure`, which never touches
  globals.
- App build: `entry-global` when `core-js` is installed, else no polyfills.
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
- `loose` only affects class features and legacy decorators; use top-level
  `assumptions` for everything else.
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
