# Validation Strategies for `packages/*`

Run all commands from `/home/ntucker/src/anansi` using Yarn (`yarn@4.10.3`). Prefer workspace-specific scripts so validation stays scoped to the package you are touching.

## `@anansi/babel-preset` (`packages/babel-preset-anansi`)
- Automated: `yarn workspace @anansi/babel-preset run test`
- Type safety: `yarn workspace @anansi/babel-preset run test:type`
- Notes: `build` is a stub; rely on the Jest suite for regression coverage.

## `@anansi/browserslist-config` (`packages/browserslist-config-anansi`)
- Automated: none (configuration-only package).
- Validation strategy: inspect `index.js` changes and run a consumer lint (`yarn lint`) or `npx browserslist \"extends @anansi/browserslist-config\"` in the repo to confirm the targets.

## `@anansi/cli` (`packages/cli`)
- Lint: `yarn workspace @anansi/cli run pretest`
- Smoke test: `node packages/cli/run.mjs --help` to confirm the binary loads after changes.
- Notes: the `test` script intentionally exits with code 1; rely on linting plus manual smoke checks.

## `@anansi/core` (`packages/core`)
- Unit/integration: `yarn workspace @anansi/core run test`
- Type safety: `yarn workspace @anansi/core run test:type`
- Build artifacts: `yarn workspace @anansi/core run build`
- Clean rebuild when needed: `yarn workspace @anansi/core run build:clean && yarn workspace @anansi/core run build`

## `@anansi/eslint-plugin` (`packages/eslint-plugin`)
- Automated: none (plugin wraps static rule configuration).
- Validation strategy: `yarn g:lint packages/eslint-plugin` and, when rules change, exercise them via an example project or `yarn lint` at the root.

## `@anansi/generator-js` (`packages/generator-js`)
- Unit/integration: `yarn workspace @anansi/generator-js run test`
- Type safety: `yarn workspace @anansi/generator-js run test:type`
- Build artifacts/templates: `yarn workspace @anansi/generator-js run build`

## `@anansi/jest-preset` (`packages/jest-preset-anansi`)
- Preflight lint: `yarn workspace @anansi/jest-preset run pretest`
- Build artifacts/templates: `yarn workspace @anansi/jest-preset run build`
- Notes: the `test` script is a placeholder; rely on pretest plus consumer Jest runs.

## `@pojo-router/core` (`packages/pojo-router`)
- Unit/integration: `yarn workspace @pojo-router/core run test`
- Type safety: `yarn workspace @pojo-router/core run test:type`
- Build artifacts: `yarn workspace @pojo-router/core run build`

## `@anansi/router` (`packages/router`)
- Unit/integration: `yarn workspace @anansi/router run test`
- Type safety: `yarn workspace @anansi/router run test:type`
- Build artifacts: `yarn workspace @anansi/router run build`

## `@anansi/storybook` (`packages/storybook`)
- Unit/integration: `yarn workspace @anansi/storybook run test`
- Type safety: `yarn workspace @anansi/storybook run test:type`
- Bundle output: `yarn workspace @anansi/storybook run build`

## `@anansi/ts-utils` (`packages/ts-utils`)
- Build artifacts/types: `yarn workspace @anansi/ts-utils run build`
- Notes: the `test` script is a placeholder; use downstream TypeScript builds to confirm changes.

## `@anansi/webpack-config` (`packages/webpack-config-anansi`)
- Unit/integration: `yarn workspace @anansi/webpack-config run test`
- CI parity: `yarn workspace @anansi/webpack-config run test:ci`
- Bundle output: `yarn workspace @anansi/webpack-config run build`
- Notes: run `yarn workspace @anansi/webpack-config run build:clean` before rebuilding if loader output changes significantly.

