# anansi

Yarn 4 workspaces monorepo: published packages in `packages/*`, demo apps in `examples/*`. Its main consumer is [reactive/data-client](https://github.com/reactive/data-client), which builds, tests, lints, publishes and builds its website with these packages, so a change here can break it without failing anything in this repo.

## Environment

- Node per `.nvmrc` (24; Jest's `require(ESM)` of Babel 8 needs 24.9+). CI uses `cimg/node:lts`.
- Yarn comes from `.yarn/releases` via `yarnPath`. Don't `corepack enable` in sandboxed sessions: corepack downloads yarn from repo.yarnpkg.com, which egress may block.
- Setup: `yarn install --mode=skip-build && yarn build:pkg`. Inside the workspace, packages with only `main` (`@anansi/webpack-config`) or an `exports` map (`@anansi/core`) resolve to their built `lib/`/`dist/`, so rebuild a package after editing its `src/` before validating anything that uses it. `@anansi/router` and `@pojo-router/core` point `module` at `src/`, so webpack builds them from source.
- Edit `src/` where a package has one; `lib/`, `dist/` and `packages/generator-js/generators/` are build output. Packages without `src/` (`babel-preset-anansi`, `browserslist-config-anansi`, `cli`, `eslint-plugin`, `ts-utils`) are edited in place.

## Validation tiers

Pick the cheapest tier that covers the change. Path-scoped rules in `.cursor/rules/` (mirrored to `.claude/rules/`) hold the per-package and per-directory commands.

1. **Packages**: `yarn lint`, `yarn test:type`, `yarn constraints`, `yarn workspaces foreach -Wv run test:ci --passWithNoTests`, or the package's own scripts.
2. **Apps (SPA/SSR)**: `examples/*` consume packages through workspaces (the local checkout, not packed tarballs), so they validate runtime behavior but not packaging. CI runs:
   - `yarn workspaces foreach -Wv --include 'example-*' run build` (CI spreads the examples across parallel nodes)
   - `yarn workspaces foreach -Wv --include 'example-*' run build:server`
   - `yarn devtest:ci` (starts dev servers and checks they respond)
   - `yarn workspace example-typescript build:storybook`
   - `BROWSERSLIST_ENV=2018 yarn workspace example-typescript run build` (also 2020, 2022)
3. **Packaging, end to end**: `scripts/consumer-link.sh` packs every public package (`yarn pack` applies `publishConfig` and rewrites `workspace:` ranges, exactly what npm receives) and points the consumer's `resolutions` at the tarballs:

   ```bash
   scripts/consumer-link.sh link     # pack + install into ../data-client (rerun after each change)
   scripts/consumer-link.sh status
   scripts/consumer-link.sh unlink   # restore data-client's package.json and yarn.lock
   ```

   Pass another consumer path as the second argument. While linked, never commit the consumer's `package.json`/`yarn.lock`. Then in data-client (Node per its `.nvmrc`), mirror its CI:

   ```bash
   yarn build                                         # package builds (babel/rollup via @anansi/babel-preset)
   yarn lint --quiet packages/*/src                   # @anansi/eslint-plugin
   yarn run tsc --project tsconfig.test.json --noEmit
   yarn test:ci                                       # @anansi/jest-preset
   yarn workspace rdc-website build                   # docusaurus site
   ```

   `scripts/pnp-consumer.sh` packs the same way into a small Yarn PnP project (`scripts/pnp-consumer/`), loads every package and runs Jest, ESLint and browser and node-target webpack builds there. PnP only lets a package require what it declares, so it catches missing dependencies that hoisting hides. This repo can't run on PnP itself until TypeScript 7's tsc supports it, and CI doesn't run this, so run it when a change to a published package could break PnP resolution: it adds or moves a dependency, resolves a module by name (`require.resolve`, preset, plugin or loader names) or changes webpack externals, or you're unsure. `SKIP_BUILD=1` (about 90s) skips `yarn build:pkg`, so use it only when `lib/`/`dist/` are built from the current `src/`.

## Commits and releases

- PRs are squash-merged; the title is the commit, and lerna turns commits into each package's version bump and CHANGELOG section (`lerna.json`, preset `conventional-changelog-anansi`). commitlint allows only `feat`, `enhance`, `fix`, `pkg` (dependency updates), `internal` and `docs`. A `!` after the type (`pkg!:`) or a `BREAKING CHANGE:` footer makes the release major.
- Don't bump `version` fields or edit `CHANGELOG.md` in a PR; the release does: `yarn changelog` (lerna version) writes both, then `yarn release` publishes.
