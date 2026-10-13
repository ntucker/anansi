# Apps with @anansi/webpack-config

## Setup

```js
// webpack.config.js
const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: 'src', // source root; also the root for bare imports
  buildDir: 'dist/', // prod client output (default generated_assets/)
  serverDir: 'dist-server/', // --target=node output (default server_assets/)
  htmlOptions: { title: 'My App' }, // index.html; false skips it in prod
};

const generateConfig = makeConfig(options);

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  // only mutate for what no option covers
  return config;
};
module.exports.options = options;
```

```json
{
  "scripts": {
    "start": "webpack serve --mode=development",
    "build": "webpack --mode=production",
    "build:server": "webpack --mode=production --target=node",
    "build:analyze": "webpack --mode=production --env analyze",
    "test:pkg": "webpack --env check=nobuild"
  },
  "browserslist": ["extends @anansi/browserslist-config"]
}
```

`tsconfig.json` needs `"types": ["@anansi/webpack-config/types"]` so asset,
style, svg and worker imports typecheck.

## Options worth knowing

- `sassResources: [path]` injects variables/mixins into every sass file.
- `globalStyleDir` (default `style`): files there are global CSS; every other
  `.css`/`.scss` is a CSS module (`import * as styles from './x.scss'`).
- `libraryInclude` / `libraryExclude`: compile workspace packages that are
  symlinked into `node_modules`; set both.
- `tsconfigPathsOptions` (on by default): tsconfig `paths` aliases such as
  `@/*` resolve in webpack.
- `sassOptions`, `inJSOptions` (Linaria via wyw-in-js), `cssExtractOptions`,
  `tsconfigPathsOptions`, `globalStyleDir`, `svgoOptions` (also stops SVGR's
  SVGO), `svgrOptions` (JS/TS svg imports give only the file URL;
  `ReactComponent` is still typed but undefined) and (prod only)
  `htmlOptions` take `false` to disable. Also: `terserOptions`,
  `babelLoader`, `fontPreload`, `nohash`, `library`, `pkg`.
- Linaria runs on wyw-in-js 2: styles are evaluated with Oxc, not your Babel
  config; imports resolve through webpack, so aliases and tsconfig `paths`
  work. Linaria 8+ resolves static values without running the evaluator.

## CLI flags and env

- `--env analyze | profile | readable | nohash | check[=nobuild]`
- `--env entrypath=./src/main.tsx`, `--env name=App`, `--target=node`
- `WEBPACK_PUBLIC_HOST` + `WEBPACK_PUBLIC_PATH` form `publicPath` (CDN/subdir).
- `WEBPACK_CACHE=none|memory|filesystem`, `NO_HOT_RELOAD=true`,
  `HTTPS=true` (or `SSL_CRT_FILE`/`SSL_KEY_FILE`) for the dev server.
- `BROWSERSLIST_ENV` picks `@anansi/browserslist-config` targets
  (`legacy`, `development`, `test`, and dated sets like `2020`).

## Imports that just work

TS/JS, workers via `new Worker(new URL('./w.ts', import.meta.url))`, WASM,
css/scss modules, fonts and media as URLs, `.svg` as URL or
`{ ReactComponent }`, `.md`/`.txt` as strings, JSON. react-refresh turns on
when `react-refresh` is installed. Don't add loaders for these.

## Storybook

Install `storybook @storybook/react @anansi/storybook` (or
`anansi add storybook`) and set `framework: { name: '@anansi/storybook' }` in
`.storybook/main.js`. It loads `../webpack.config` from `.storybook`, so keep
that file at the project root and exporting the config function.
