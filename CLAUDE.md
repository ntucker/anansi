# anansi

Yarn 4 workspaces monorepo: published packages in `packages/*`, demo apps in `examples/*`.
Conventions and per-package checks live in `.cursor/rules/general.mdc` and `.cursor/rules/validation.mdc`.

## Environment

- Node 24.9+ (Jest's `require(ESM)` of Babel 8 fails on Node 22). CI uses `cimg/node:lts`.
- Yarn comes from `.yarn/releases` via `yarnPath`. Don't `corepack enable` in cloud sessions: corepack downloads yarn from repo.yarnpkg.com, which egress may block.
- Setup: `yarn install && yarn build:pkg`. Cloud sessions with this repo as their root run `.claude/hooks/session-start.sh`, which does this, and also runs `yarn install` in a sibling `../data-client` checkout when one exists.

## Validation tiers

Pick the cheapest tier that covers the change.

1. **Packages**: `yarn lint`, `yarn workspaces foreach -Wv run test:ci --passWithNoTests`, or the scoped commands in `validation.mdc`.
2. **Apps (SPA/SSR)**: `examples/*` consume packages through workspaces (source, not packed builds), so they validate runtime behavior but not packaging. CI runs:
   - `yarn workspaces foreach -Wv --include 'example-*' run build`
   - `yarn workspaces foreach -Wv --include 'example-*' run build:server`
   - `yarn devtest:ci` (starts dev servers and checks they respond)
   - `yarn workspace example-typescript build:storybook`
   - `BROWSERSLIST_ENV=2018 yarn workspace example-typescript run build` (also 2020, 2022)
3. **Packaging, end to end**: [reactive/data-client](https://github.com/reactive/data-client) builds, tests, publishes and builds its website with anansi. `scripts/consumer-link.sh` packs every public package (`yarn pack` applies `publishConfig` and rewrites `workspace:` ranges, exactly what npm receives) and points the consumer's `resolutions` at the tarballs:

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
