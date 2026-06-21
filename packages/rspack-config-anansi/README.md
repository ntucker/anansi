# @anansi/rspack-config

[![npm version](https://img.shields.io/npm/v/@anansi/rspack-config.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/rspack-config)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Production ready Rsbuild configuration for React, mirroring the option surface of [`@anansi/webpack-config`](https://www.npmjs.com/package/@anansi/webpack-config) but built on [Rsbuild](https://rsbuild.rs) (which uses [Rspack](https://rspack.rs)) instead of webpack 5.

The babel pipeline (`@anansi/babel-preset`, `react-refresh/babel`, and the wyw-in-js babel options) is preserved via [`@rsbuild/plugin-babel`](https://rsbuild.rs/plugins/list/plugin-babel). SWC handles syntax downleveling and JSX runtime, the rspack-native fast refresh plugin handles HMR.

## Installation

```bash
yarn add --dev \
  @rsbuild/core \
  @rsbuild/plugin-react \
  @rsbuild/plugin-babel \
  @rsbuild/plugin-svgr \
  @rsbuild/plugin-sass \
  @rsbuild/plugin-node-polyfill \
  @anansi/rspack-config react-refresh
```

If you use sass, also install `sass` or `sass-embedded`. If you want bundle analysis, install `@rsdoctor/rspack-plugin`.

## Configuration

```ts
// rsbuild.config.ts
import { makeConfig } from '@anansi/rspack-config';

export default makeConfig({
  basePath: 'src',
  buildDir: 'dist/',
});
```

To extend the produced config, merge with `@rsbuild/core`:

```ts
import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import { makeConfig } from '@anansi/rspack-config';

export default defineConfig(
  mergeRsbuildConfig(
    makeConfig({ basePath: 'src', buildDir: 'dist/' }),
    {
      splitChunks: {
        cacheGroups: {
          router: {
            test: /[\\/]node_modules[\\/](react-router|history)[\\/]/,
            name: 'router',
            chunks: 'all',
          },
        },
      },
    },
  ),
);
```

### Scripts

```json
{
  "scripts": {
    "start": "rsbuild dev",
    "build": "rsbuild build",
    "build:server": "RSBUILD_TARGET=node rsbuild build",
    "build:analyze": "RSBUILD_ANALYZE=true rsbuild build",
    "build:profile": "RSBUILD_PROFILE=true rsbuild build",
    "pkgcheck": "RSBUILD_CHECK=nobuild rsbuild build",
    "preview": "rsbuild preview"
  }
}
```

## Options

`makeConfig(options)` accepts (see `index.d.ts` for the complete TypeScript shape):

| Option | Default | Notes |
|---|---|---|
| `rootPath` | `process.cwd()` | Project root |
| `basePath` | `'src'` | Source directory relative to `rootPath` |
| `buildDir` | `'generated_assets/'` | Output directory |
| `serverDir` | `'server_assets/'` | Output directory for `target: 'node'` |
| `manifestFilename` | `'manifest.json'` | Set to falsy to disable manifest |
| `target` | `'web'` | Use `'node'` for SSR / library node builds |
| `htmlOptions` | `{ title: 'Anansi app' }` | `false` disables HTML output |
| `sassOptions` | `{ outputStyle: 'expanded' }` | `false` disables sass entirely |
| `sassResources` | `undefined` | Files passed to `sass-resources-loader` |
| `cssExtractOptions` | `undefined` | `false` inlines CSS via style-loader |
| `cssModulesOptions` | `{}` | Merged into Rsbuild's `output.cssModules` |
| `inJSOptions` | wyw enabled | wyw-in-js loader options. `false` disables Linaria-style extraction |
| `svgoOptions` | preset defaults | `false` disables svgo |
| `svgrOptions` | `mixedImport: true` | `false` disables SVGR |
| `tsconfigPathsOptions` | uses tsconfig.json | `false` disables tsconfig path resolution |
| `globalStyleDir` | `'style'` | `false` disables global style scope |
| `fontPreload` | `undefined` | `'preload'` or `'prefetch'` injects `<link>` tags for fonts |
| `library` | `false` | Set to `{ type }` for library bundles |
| `pkg` | `undefined` | Pass `package.json` for library defaults |
| `analyze` | `false` | Adds Rsdoctor (or webpack-bundle-analyzer fallback) |
| `check` | `false` | Adds CircularDependencyRspackPlugin + Rsdoctor duplicate analysis. Use `'nobuild'` to fail-fast |
| `profile` | `false` | Aliases `react-dom` to the profiling build |
| `babelLoader` | `{}` | Extra options merged into the generated babel-loader options |
| `extraPlugins` | `[]` | Additional Rsbuild plugins |

## Validation

The package was validated against `examples/linaria` (the reference migration). Results:

| Check | Result |
|---|---|
| `rsbuild dev` | starts, HMR ready in <1 s |
| `rsbuild build` (web) | succeeds, hashed filenames, manifest emitted |
| Linaria CSS extraction | `App.[hash].css` emitted, dedupe + ordering match |
| SVGR mixed import | `<img src={AngleDownUrl}>` works (default = URL) |
| SVG `url(...)` in linaria CSS | resolves to `/static/svg/[name].[hash].svg` |
| Font preload (`fontPreload: 'preload'`) | `<link rel="preload" as="font">` injected |
| Manifest format | `manifest.json` with `allFiles` / `entries` keys |
| Bundle analysis (`RSBUILD_ANALYZE=true`) | runs through Rsdoctor (when installed) or webpack-bundle-analyzer fallback |
| `target: 'node'` | externalises bare imports, emits CJS |
| TypeScript `types: ["@anansi/rspack-config/types"]` | resolves SVG / image module declarations |
| ESLint | clean (workspace ESLint config covers `packages/rspack-config-anansi/**`) |

### Known migration deltas

- **CSS-context SVG asset emit**: SVGs referenced from `url(...)` inside CSS (including wyw-in-js extracted CSS) are emitted as `asset/resource` (file URL) rather than inlined as `data:` URI. This is required because rspack's ES-module asset exports otherwise stringify as `[object Module]` when css-loader resolves the import. JS-context SVG imports continue to follow the inline-or-resource heuristic.
- **Manifest schema**: backed by Rsbuild's `output.manifest`. The shape (`allFiles`, `entries`, `routeAssets`) differs from `webpack-stats-plugin`. Set `output.manifest.generate` to match the old shape if needed.
- **Dev overlay**: `react-error-overlay` is replaced by `@rsbuild/plugin-react`'s overlay.
- **Worker loader**: `*.worker.{ts,js}` is no longer auto-detected. Use `new Worker(new URL('./worker.ts', import.meta.url))`.

## Differences from `@anansi/webpack-config`

- **Bundler**: Rsbuild (rspack) replaces webpack 5. Rsbuild uses SWC for downleveling alongside our existing babel pass.
- **Worker support**: the deprecated `*.worker.ts` `worker-loader` path is removed. Use `new Worker(new URL('./worker.ts', import.meta.url))` (already supported in webpack 5 too).
- **Dev overlay**: the bespoke `react-error-overlay`-based overlay is dropped in favor of Rsbuild + `@rsbuild/plugin-react`'s overlay.
- **Bundle analysis**: `--env analyze` (or `RSBUILD_ANALYZE=true`) registers Rsdoctor when installed; otherwise `webpack-bundle-analyzer` if installed; otherwise warns.
- **HTML preload/prefetch**: handled by Rsbuild's `performance.preload` / `performance.prefetch` rather than `@vue/preload-webpack-plugin`.
- **Manifest**: backed by `output.manifest`. The shape differs from `webpack-stats-plugin`; use `output.manifest.generate` if you need to match the old shape.
- **Storybook**: Storybook adopters must switch to [storybook-react-rsbuild](https://storybook.rsbuild.rs/guide/framework/react). Use `makeStorybookRsbuildConfig` from `@anansi/rspack-config` inside `rsbuildFinal`.

## Storybook integration

```ts
// .storybook/main.ts
import type { StorybookConfig } from 'storybook-react-rsbuild';
import { makeStorybookRsbuildConfig } from '@anansi/rspack-config';

const config: StorybookConfig = {
  framework: 'storybook-react-rsbuild',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  rsbuildFinal: makeStorybookRsbuildConfig({ basePath: 'src' }),
};

export default config;
```
