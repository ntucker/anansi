---
paths:
  - "**/package.json"
  - "yarn.lock"
  - ".yarnrc.yml"
  - "renovate.json"
  - ".github/dependabot.yml"
---
<!-- Generated from .cursor/rules/dependencies.mdc by `yarn build:agent-rules`. Edit the source. -->


# Dependencies

- Never plain `yarn install` (always `--mode=skip-build`): it runs every workspace's install scripts, and security scanners flag it. CI uses `yarn install --immutable`, so commit `yarn.lock` with any manifest change.
- Root `resolutions` pin one React, `@types/react` and storybook/webpack copy for the whole tree. Bump a pinned package there as well as in the manifests that depend on it. The other scoped entries (`serve/compression`, `sockjs/uuid`, `write-package/deepmerge-ts`, `@ant-design/pro-layout/path-to-regexp`, `@storybook/builder-webpack5/webpack-dev-middleware`) force patched versions for `yarn npm audit` advisories; drop each once its parent ships the fix.
- Renovate owns routine bumps (`pkg: ` titles, grouped as `renovate.json` sets). Hand-made upgrades use the same `pkg:` type; a major that changes what consumers must install, or a raised `engines` floor, is breaking: use a `pkg!:` title or a `BREAKING CHANGE:` footer (Babel 8, #3084, used the footer).
- A major of anything a preset wraps (Babel, webpack, Jest, ESLint, TypeScript, React) is a packaging change for data-client: run the end-to-end tier in `AGENTS.md`.
