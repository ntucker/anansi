# Using Anansi

Anansi is a set of shared configs and runtime packages for React apps and npm
libraries. Projects extend these configs rather than hand-writing webpack,
babel, jest or eslint setups, so upgrading an `@anansi/*` package upgrades the
toolchain.

## Packages

- `@anansi/webpack-config`: webpack for apps: dev server, prod and SSR server
  builds. Covers `@anansi/storybook` and `@anansi/browserslist-config` too.
- `@anansi/core` + `@anansi/router`: streaming SSR ("spouts") and Suspense
  routing.
- `@anansi/babel-preset`: Babel 8 preset for apps, libraries and tests.
- `@anansi/jest-preset`: Jest wired to the same transforms as webpack.
- `@anansi/eslint-plugin`: flat ESLint configs for React + TypeScript.

## Rules

- Extend, don't replace. Wrap `makeConfig()` output, pass options to the
  `@anansi` babel preset, spread `anansiPlugin.configs.*`, set
  `preset: '@anansi/jest-preset'`. Prefer documented options and env vars;
  mutate generated config only for what no option covers.
- One babel config serves webpack, jest and library builds. Babel reads the
  caller (webpack, jest, rollup, `@babel/cli`) and adjusts targets, modules and
  polyfills, so don't add per-tool babel configs.
- Use `anansi add <feature>` to adopt testing, storybook or CI in an existing
  project instead of hand-copying setup.

## CLI

```bash
anansi hatch my-app            # new SPA or library (interactive)
anansi add testing storybook   # also: circle, github-actions
anansi serve --dev ./src/index.tsx      # SSR dev server (needs @anansi/core)
anansi serve ./dist-server/App.js -a    # SSR prod server, also serving assets
```

`anansi serve` sets `WEBPACK_PUBLIC_PATH` to `/assets/` in dev and `/`
otherwise unless you set it or pass `--pubPath`. Prod server port is `PORT`
(default 8080).
