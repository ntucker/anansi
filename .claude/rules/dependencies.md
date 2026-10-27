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
- Root `resolutions` pin one React, `@types/react` and storybook/webpack copy for the whole tree. Bump a pinned package there as well as in the manifests that depend on it. Other entries that target a parent's dependency (`serve/compression`, `@scope/parent/dep`) force patched versions for `yarn npm audit` advisories; drop each once its parent ships the fix. Keys naming one package (`react`, `@scope/pkg`) are plain pins. Delete a `parent/child` key that matches nothing in `yarn.lock`.
- Drop each override once the parent's declared minimum is at or above the patched version (for example, express moves to `body-parser@^2.4.0`). A caret range that merely includes the patch still leaves a lower floor, so a fresh resolve can pick a vulnerable copy. Ranges below are what the parent still declares:
  - `serve/compression` `^1.8.2` — `serve@14.2.6` depends on `compression@1.8.1`.
  - `@ant-design/pro-layout/path-to-regexp` `^8.4.0` — pro-layout `7.22.7` depends on `path-to-regexp@8.2.0`. Keep it scoped: `react-router` still needs 1.x and `serve-handler` needs 3.3.0.
  - `express/body-parser` `^2.4.0` — `express@5.3.0` depends on `^2.3.0`.
  - `ajv/fast-uri` `^3.1.9` — ajv depends on `^3.0.1`. Stay on fast-uri 3.x.
  - `jest-worker/@ungap/structured-clone` `^1.3.4` — `jest-worker@30.5.1` depends on `^1.3.0`.
  - `node-gyp/undici` `^8.12.2` — `node-gyp@13.1.0` depends on `^8.4.1`.
  - `socks/ip-address` `^10.7.4` — `socks@2.8.10` depends on `^10.1.1`.
  - `@wyw-in-js/transform/happy-dom` `^21.0.4` — transform `2.7.0` depends on `^20.1.0`, which can never select 21, so this forces a major (happy-dom 21 disables CSS and iframe loading by default). Remove both the root copy and the `scripts/pnp-consumer` copy when `@wyw-in-js/transform`'s range is `^21.0.4` or higher.
- Renovate owns routine bumps (`pkg: ` titles, grouped as `renovate.json` sets). Hand-made upgrades use the same `pkg:` type; a major that changes what consumers must install, or a raised `engines` floor, is breaking: use a `pkg!:` title or a `BREAKING CHANGE:` footer (Babel 8, #3084, used the footer).
- A major of anything a preset wraps (Babel, webpack, Jest, ESLint, TypeScript, React) is a packaging change for data-client: run the end-to-end tier in `AGENTS.md`.
