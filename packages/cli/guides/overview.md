# Using Anansi

Anansi is a set of shared configs and runtime packages for React apps and npm
libraries. Projects extend these configs rather than hand-writing webpack,
babel, jest or eslint setups, so upgrading an `@anansi/*` package upgrades the
toolchain.

## Packages

- `@anansi/cli`: `anansi hatch`, `add`, `serve`, `guide` (this page)
- `@anansi/webpack-config`: webpack for apps, dev server, prod and SSR server
  builds. Guide: `app`
- `@anansi/core` + `@anansi/router`: streaming SSR ("spouts") and Suspense
  routing. Guide: `ssr`
- `@anansi/babel-preset`: Babel 8 preset for apps, libraries and tests.
  Guide: `library`
- `@anansi/jest-preset`: Jest wired to the same transforms as webpack.
  Guide: `testing`
- `@anansi/eslint-plugin`: flat ESLint configs for React + TypeScript.
  Guide: `lint`
- `@anansi/storybook`, `@anansi/browserslist-config`: Storybook reusing the
  app's webpack config, and shared browser targets. Guide: `app`

Read a topic with `anansi guide <topic>`, or several with
`anansi guide app testing`. Without a global install, run
`npx @anansi/cli guide <topic>`.

## Rules

- Extend, don't replace. Wrap `makeConfig()` output, pass options to the
  `@anansi` babel preset, spread `anansiPlugin.configs.*`, set
  `preset: '@anansi/jest-preset'`. Copying their internals forks the toolchain.
- Configure through documented options and env vars before mutating the
  generated webpack config; mutate only for what no option covers.
- One babel config serves webpack, jest and library builds. Babel reads the
  caller (webpack, jest, rollup, `@babel/cli`) and adjusts targets, modules and
  polyfills, so don't add per-tool babel configs.
- Use `anansi add <feature>` to adopt testing, storybook or CI in an existing
  project instead of hand-copying setup.
- Package READMEs on npm document every option; these guides cover what agents
  most often get wrong.

## CLI

```bash
anansi hatch my-app            # new SPA or library (interactive)
anansi add testing storybook   # also: circle, github-actions
anansi serve --dev ./src/index.tsx      # SSR dev server (needs @anansi/core)
anansi serve ./dist-server/App.js -a    # SSR prod server, also serving assets
anansi guide [topics...]       # these guides
```

`anansi serve` sets `WEBPACK_PUBLIC_PATH` to `/assets/` in dev and `/`
otherwise unless you set it or pass `--pubPath`. Prod server port is `PORT`
(default 8080).
