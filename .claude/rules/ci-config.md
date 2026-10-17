---
paths:
  - ".circleci/**"
  - ".github/workflows/**"
---
<!-- Generated from .cursor/rules/ci-config.mdc by `yarn build:agent-rules`. Edit the source. -->


# CI configuration

- CircleCI (`.circleci/config.yml`) is the PR gate: `build` installs and runs `yarn build:pkg` once, then `lint` (also `yarn constraints`), `test` (webpack-config's suite runs separately in `test_webpack_config`), `build_production` (each `examples/*` dir, spread across `parallelism` nodes), the `BROWSERSLIST_ENV` matrix, `start_dev` and storybook reuse that install through `attach_workspace`; `salus` runs a security scan. GitHub Actions run commitlint, bundle size, lighthouse, `renovate.json` validation, a manual `combine-prs`, and `.github/workflows/release.yml` on push to `master`. That workflow is the npm trusted publisher: its `release` job sets `id-token: write`, `contents: write`, and `pull-requests: write`.
- Branch protection requires the `ci/circleci: build_production` check, so keep that job name.
- The commands in `AGENTS.md`'s validation tiers mirror these jobs; change both together.
- Example workspace names are wired in several places: `--include 'example-*'` filters, `build_production`'s `examples/*/package.json` glob, root `devtest:ci`, `build_matrix`/`build_storybook` (`example-typescript`), `lighthouse.yml` (`example-react-18`) and `bundle_size.yml` (`build:sizecompare`). Renaming or adding an example means updating each.
