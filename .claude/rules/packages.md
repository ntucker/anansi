---
paths:
  - "packages/**"
---
<!-- Generated from .cursor/rules/packages.mdc by `yarn build:agent-rules`. Edit the source. -->


# Packages

## Validating one package

Run from the repo root. Yarn 4 never runs `pre*` scripts on its own, so a `pretest` listed here runs only when called by name.

| Package (folder) | Checks |
|---|---|
| `@anansi/babel-preset` (`babel-preset-anansi`) | `yarn workspace @anansi/babel-preset run test` (snapshots per browserslist target; `-u` only for intended output changes) |
| `@anansi/browserslist-config` (`browserslist-config-anansi`) | No tests. `npx browserslist "extends @anansi/browserslist-config"`, plus `BROWSERSLIST_ENV=<env> yarn workspace example-typescript run build` for each env you changed |
| `@anansi/cli` (`cli`) | `run pretest` (lint), `node packages/cli/run.mjs --help`; for `guide`, run `node ../../packages/cli/run.mjs guide <topic>` from `examples/concurrent` (it reads guides from the project's installed packages) |
| `@anansi/core` (`core`) | `run test`, `run test:type`, `run build`; SSR changes also need `example-react-18` |
| `@anansi/eslint-plugin` (`eslint-plugin`) | No tests. `yarn g:lint packages/eslint-plugin`, `yarn lint` (the root config uses this plugin), plus data-client's lint |
| `@anansi/generator-js` (`generator-js`) | `run test`, `run test:type`, `run build` |
| `@anansi/jest-preset` (`jest-preset-anansi`) | `run test`, `run build`; `example-typescript`'s `test` exercises the preset |
| `@pojo-router/core` (`pojo-router`) | No tests. `run test:type`, `run build`; no example uses it |
| `@anansi/router` (`router`) | No tests. `run test:type`, `run build`, `example-react-18` |
| `@anansi/storybook` (`storybook`) | No tests. `run test:type`, `run build`, `yarn workspace example-typescript build:storybook` |
| `@anansi/ts-utils` (`ts-utils`) | `run build` |
| `@anansi/webpack-config` (`webpack-config-anansi`) | `run test` (unit and fixture builds), `run build`, then the example builds |

## What CI misses

CI's `test` job runs each workspace's `test:ci`; its `lint` job runs `yarn lint` and `yarn test:type`. No other package script (such as `pretest`) runs in CI.

## Publish surface

- `publishConfig` replaces `main`/`module`/`types` at pack time, so the workspace and npm can resolve different files. Change entry points in both places, and check any packaging change with `scripts/consumer-link.sh`.
- `@anansi/babel-preset`, `@anansi/webpack-config`, `@anansi/jest-preset`, `@anansi/eslint-plugin`, `@anansi/browserslist-config`, `@anansi/core`, `@anansi/router` and `@anansi/cli` are data-client dependencies; changes to their options, defaults or peer ranges need the end-to-end tier in `AGENTS.md`.
- `guide.md` in `webpack-config-anansi`, `core`, `babel-preset-anansi`, `jest-preset-anansi` and `eslint-plugin` is published and printed by `anansi guide <topic>` (topic map in `packages/cli/run.mjs`). When a package's options, defaults or recommended setup change, update its `guide.md` in the same PR, checking claims against source rather than the README.
- `@anansi/generator-js` templates (`src/*/templates/`) are what new projects start from. When a preset's options or required peers change, update the matching template (e.g. `src/base/templates/.babelrc.js`).
