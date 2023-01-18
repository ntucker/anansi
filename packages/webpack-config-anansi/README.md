# Production ready webpack for React
[![CircleCI](https://circleci.com/gh/ntucker/anansi.svg?style=shield)](https://circleci.com/gh/ntucker/anansi)
[![npm downloads](https://img.shields.io/npm/dm/@anansi/webpack-config.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/webpack-config)
[![npm version](https://img.shields.io/npm/v/@anansi/webpack-config.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/webpack-config)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A webpack 5 configuration for fast development and production ready optimizations.

(For webpack 4 compatible config, use [@anansi/webpack-config@5.4.1](https://www.npmjs.com/package/@anansi/webpack-config/v/5.4.1))

## Installation

```bash
yarn add --dev webpack webpack-cli webpack-dev-server react-refresh @anansi/webpack-config
```

or

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server react-refresh @anansi/webpack-config
```

If using sass, be sure to install it as well

```bash
yarn add --dev sass
```

## Configuration

<details open><summary><b>/webpack.config.js</b></summary>

```javascript
const { makeConfig } = require('@anansi/webpack-config');

// See #options below
const options = {
  basePath: 'src',
  buildDir: 'generated_assets/',
};

module.exports = { options };

module.exports = makeConfig(options);
```

</details>

<details><summary><b>Advanced configuration /webpack.config.js</b></summary>

```javascript
const { makeConfig } = require('@anansi/webpack-config');

// See #options below
const options = {
  basePath: 'src',
  buildDir: 'generated_assets/',
};

module.exports = { options };

const baseConfig = makeConfig(options);

module.exports = (env, argv) => {
  const config = baseConfig(env, argv);

  // Config is fully available for modification
  // Adding any custom plugins is simple
  config.plugins.push(
    new CspHtmlWebpackPlugin()
  );

  return config;
}
```

</details>


[See Options](#options) for more options to configure

</details>

<details open><summary><b>/package.json</b></summary>

```json
{
  "scripts": {
    "start": "webpack serve --mode=development",
    "build": "webpack --mode=production",
    "build:server": "webpack --mode=production --target=node",
    "build:analyze": "webpack --mode=production --env analyze",
    "build:profile": "webpack --mode=production --env profile",
    "test:pkg": "webpack --env check=nobuild"
  }
}
```

(`--env` requires webpack-cli >= v4)

[See cmd-line-arguments](#cmd-line-arguments) for more detail.

[See ENV](#env-customization) to use [environmental variables](https://www.networkworld.com/article/3215965/all-you-need-to-know-about-unix-environment-variables.html) to customize builds

</details>

### TypeScript (optional)

<details open><summary><b>/tsconfig.js</b></summary>

```json
{
  "compilerOptions": {
    "types": ["@anansi/webpack-config/types"],
  }
}
```
</details>

### Storybook 6 (optional)

<details open><summary><b>/.storybook/webpack.config.js</b></summary>

```js
const { makeStorybookConfigGenerator } = require('@anansi/webpack-config');
const { options } = require('../webpack.config');

module.exports = makeStorybookConfigGenerator(options);
```
</details>

<details open><summary><b>/.storybook/main.js</b></summary>

```js
module.exports = {
  core: {
    builder: "webpack5",
  },
  reactOptions: {
    fastRefresh: true,
  },
};

```
</details>

#### Working with webpack 5 and storybook

Storybook currently has [some issues](https://gist.github.com/shilman/8856ea1786dcd247139b47b270912324) due to being a hybrid of webpack 4 and 5. This is solved by adding some 'resolutions' to your `package.json`. This will
only work with npm v7 and above, or yarn.

<details open><summary><b>package.json</b></summary>

```json
{
  "resolutions": {
    "webpack": "^5.0.0",
    "css-loader": "^5.0.0",
    "dotenv-webpack": "^6.0.0",
    "html-webpack-plugin": "^5.0.0",
    "style-loader": "^3.0.0",
    "terser-webpack-plugin": "^5.0.0",
    "webpack-virtual-modules": "^0.4.2"
  }
}
```

</details>

### Jest (optional)

```bash
yarn add --dev jest @anansi/jest-preset
```

<details open><summary><b>/jest.config.js</b></summary>

```js
module.exports = {
  preset: "@anansi/jest-preset"
}
```

</details>

## Enabling react-refresh

Install react-refresh as a dev-dependency in your project and it will automatically
be detected and enabled. Be sure to use the [anansi babel](https://www.npmjs.com/package/@anansi/babel-preset)
or include `react-refresh/babel` in your own babel configuration.

```bash
yarn add --dev react-refresh
```

## File Support

> Production builds optimize all files for size, delivery and runtime performance
>
> Development optimized for quick iteration and debuggability

- JavaScript
  - [JSX](https://reactjs.org/docs/introducing-jsx.html)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
  - [Web Assembly (WASM)](https://developer.mozilla.org/en-US/docs/WebAssembly)
- Styling (CSS)
  - [SCSS](https://sass-lang.com/) with [CSS modules](https://css-tricks.com/css-modules-part-1-need/)
    - <details><summary>By default both .css and .scss files work as <a href="https://css-tricks.com/css-modules-part-1-need/">CSS Modules</a></summary>

      ```scss
      .button {
        border-radius: 6px;
        color: black;
        background: gray;
      }
      ```

      ```js
      import styles from './myfile.scss';

      export default function MyComponent() {
        return <div className={styles.button}>Hello world</div>;
      }
      ```

      </details>
    - <details><summary>Export SCSS variables into javascript via <a href="https://github.com/css-modules/icss">icss</a></summary>

      ```scss
      :export {
        bodyColor: $body-color;
        backgroundColor: $background-color;
      }
      ```

      </details>
    - <details><summary>Provide variables/mixins to every sass file by adding <a href="#sassresources">sassResource</a></summary>

      ```js
      const { makeConfig } = require('@anansi/webpack-config');

      const options = {
        basePath: 'src',
        buildDir: 'dist/',
        sassResources: [`${__dirname}/src/style/export.scss`],
      };

      module.exports = makeConfig(options);

      module.exports.options = options;

      ```

      </details>
    - <details><summary>Apply global styles to every file in <a href="##globalstyledir--style">globalStyleDir</a></summary>

      ```js
      const { makeConfig } = require('@anansi/webpack-config');

      const options = {
        basePath: 'src',
        buildDir: 'dist/',
        globalStyleDir: 'style',
      };

      module.exports = makeConfig(options);

      module.exports.options = options;

      ```

      </details>
  - CSS in JS via [Linaria](https://github.com/callstack/linaria)
- Media
  - All font formats
  - Any media files
    - svg|png|apng|jpg|avif|gif|ico|webp|cur|ani|otf|eot|woff2|woff|ttf|pdf|mp4|webm|wav|mp3|m4a|aac|oga as file urls anywhere
    - <details><summary>SVG as file urls or components</summary>

      ```jsx
      import starUrl, { ReactComponent as Star } from './star.svg'

      const App = () => (
        <div>
          <img src={starUrl} alt="star" />
          <Star />
        </div>
      )
      ```
    </details>
- Raw string data
  - .md, .txt
- JSON as [POJO](https://en.wikipedia.org/wiki/Plain_old_Java_objects)
- HTML via [html-loader](https://www.npmjs.com/package/html-loader)

## CMD line arguments

### analyze

If set, will build a static [treemap visualization of your packages](https://www.npmjs.com/package/webpack-bundle-analyzer). Highly recommended to run in production mode to get accurate results.

`webpack --mode=production --env analyze`

### check

If set will run package checks to check for duplicates or ciruclar dependencies. Set equal to 'nobuild' for a standalone run where build output is not needed.

Examples:
`webpack --mode=production --env check` or `webpack --env check=nobuild`

### profile

If set, will enable [React DevTools Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html). This feature is only available in production mode since it is enabled in development by default.

`webpack --mode=production --env profile`

### readable

Skips minification. This is useful when trying to debug production code.

`webpack --mode=production --env readable`

### target

To target node instead of default of web. This is useful when building a node
server for SSR alongside the client bundle.

`webpack --mode=production --target=node`

### nohash

This is useful for diffing bundle filesizes as it removes cache busting filenames - keeping the name
the same as their contents change.

For example [compressed-size-action](https://github.com/preactjs/compressed-size-action) can track bundle size
changes.

`webpack --mode=production --env nohash`

## ENV customization

Environmental variable control is sometimes useful in CI pipelines
to distinguish between various deploy targets.

### WEBPACK_PUBLIC_HOST = ''

Sets domain of served files. This is useful to distinguish between different build environments that
will serve assets from different locations like a CDN.

Serves as first half of [publicPath](https://webpack.js.org/guides/public-path/)

Note: dev mode sets its own path based assets serving is completely controlled by webpack-dev-server.

### WEBPACK_PUBLIC_PATH = '/'

Forms the second half of the [publicPath](https://webpack.js.org/guides/public-path/). Can be useful when assets are served in subdirectories as
opposed to custom domains like in the case of CDNs.

### HTTPS, SSL_CRT_FILE, SSL_KEY_FILE

> Applies to webpack-dev-server only

`HTTPS=true` enables self-signed cert

`SSL_CRT_FILE` and `SSL_KEY_FILE` enable using certificates stored in files

### NO_HOT_RELOAD

Setting to 'true' will disable all hot reloading functionality (only enabled by default in dev mode).

### WEBPACK_CACHE: 'none' | 'memory' | 'filesystem'

Sets [webpack cache type](https://webpack.js.org/configuration/cache/).

## Options

Pass these to makeConfig.

### libraryInclude/libraryExclude

Regex to match libraries to include in the normal build process. This is useful for
locally developed modules or `yarn workspaces`. Not this should point to the installed
location, rather than the actual target. Note you'll need both the positive and negative
regexes.

libraryExclude defaults to `/node_modules/`, which will exclude libraries from expensive
and potentially incorrect processing from babel loaders.

With a monorepo layout like so

```
/
  /packages
    /package-a
    /package-b
  /myapp
    webpack.config.js
```

Where `package-a` and `package-b` are namespaced under `@myspacespace`:

```js
const myConfig = makeConfig({
  libraryInclude: path.resolve(__dirname, '../packages'),
  libraryExclude: /node_modules(?!\/(@mynamespace\/))/,
});
```

### basePath = 'src'

Marks the base directory inside the package for javascript source files. This
is used to make it easy to import from the root.

Example:

```bash
-package.json
-/src
  -/components
  -/pages
  -/utils
    -network.js
```

Then you can do

```javascript
import fetch from 'network';
```

from any file.

### babelRoot = \$CWD

`babelRoot` should be where the root babel configuration file is in your repo. Usually this is CWD, but while setting up a monorepo with multiple babel configurations, you may need to change this value.

### rootPath = \$CWD

Root path should be the root path of your project. Usually where your package.json and webpack.config.js are.
This defaults to the current working directory you are running commands from. However, if you need to run things
from another directory, you can send \_\_dirname into this option from your webpack.config.js.

### buildDir = 'generated_assets/'

Output directory for production build files

### serverDir: 'server_assets/'

Output directory for production server builds. Used when using `--target=node` cli option.

### mode: argv?.mode || process.env.NODE_ENV

Override the [mode](https://www.google.com/search?q=webpack+mode&oq=webpack+mode&aqs=chrome..69i57j69i60l3j0l2.1349j0j7&sourceid=chrome&ie=UTF-8)

### htmlOptions

If specified, uses [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to
build a static html file including all assets. Using this makes development easy, and allows
for cheap static deploys to CDNs like S3+cloudfront.

[Configuration options](https://github.com/jantimon/html-webpack-plugin#options)


### svgoOptions

SVG files are optimized automatically in production builds to minimize size. [SVGO](https://github.com/svg/svgo) is used for this. Set this to specify specific options. Alternatively
set to false to disable SVGO altogether. (Note: SVGO will never run in dev mode)

[Configuration options](https://github.com/svg/svgo#configuration)


### svgrOptions

SVGR enables importing SVG as a file or a component. This option allows further customizing how that is achieved.

[Configuration options](https://react-svgr.com/docs/options/)

### linariaOptions

Can configure how [linaria](https://github.com/callstack/linaria) operates. Set to `false` to disable linaria altogether. Note that
linaria has its own config files it can use, and it is recommended to use those instead.

[Configuring Linaria](https://github.com/callstack/linaria/blob/master/docs/CONFIGURATION.md#options)

### cssExtractOptions

Can configure how [MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin) operates.  Set to `false` to disable CSS extraction altogether.

[Configuration options](https://github.com/webpack-contrib/mini-css-extract-plugin#options)
### tsconfigPathOptions

Enabled by default. Uses any module resolution specifications like aliases in `tsconfig`.

Set to `false` to disable; or set to object to configure the options.

[Configuring tsconfig path options](https://github.com/dividab/tsconfig-paths-webpack-plugin#options)

### fontPreload = 'preload' | 'prefetch'

If specified, will [preload web fonts](https://web.dev/codelab-preload-web-fonts/). Choice
determines the `rel` attribute of the `link` tag.

This usually provides benefits when serving assets over HTTP/2. If using HTTP1.1 this is
typically detrimental.

### bundleAnalyzerOptions

Customize how to [analyze](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin) your bundles

### manifestFilename = 'manifest.json'

Determines the filename for the stats file that includes mappings to all filenames.

### babelLoader

Override any babel loader specific [options](https://github.com/babel/babel-loader#options).

### extraJsLoaders = []

Any extra loaders to use on JavaScript/TypeScript files.

### cssModuleOptions

Customize css module [options](https://github.com/webpack-contrib/css-loader#object).

### globalStyleDir = 'style'

Directory where only global styles are defined (no css modules)

Set to `false` to disable

### terserOptions

Used to customize [terser](https://github.com/webpack-contrib/terser-webpack-plugin#options) in prod builds.

### sassOptions

`false` disables sass altogether.

Otherwise, these [configure the sass-loader](https://github.com/webpack-contrib/sass-loader#options)

For instance, using node-sass can be done like so:

<details><summary><b>/webpack.config.js</b></summary>

```javascript
const { makeConfig } = require('@anansi/webpack-config');

// See #options below
const options = {
  sassOptions: {
    implementation: require("sass"),
  }
};

module.exports = { options };

module.exports = makeConfig(options);
```

</details>

### sassResources

`resources` option from https://github.com/shakacode/sass-resources-loader#readme

This is useful to specify global variables and mixins to be included in every sass file.

### Working with TypeScript

Add `@anansi/webpack-config/types` to the types in `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["@anansi/webpack-config/types"],
  }
}
```

This makes all imports of supported formats typed correctly, including svgs, media files and workers.

e.g.,

```tsx
import plain from './plain.css';
import Worker from './my.worker.ts';
import angleDownUrl, {
  ReactComponent as AngleDown,
} from './angle-down-solid.svg';

worker.postMessage({ message: 'rendered' });

export default function MyComponent() {
  return (
    <>
      <AngleDown className={plain.svg} />
      <img src={angleDownUrl} />
    </>
  );
}
```

### Working with Linaria

When testing modules that use Linaria, it's important to add the linaria babel preset to the babel config.

1. Install linaria: `yarn add --dev @linaria/core @linaria/react @linaria/babel-preset @linaria/shaker`
3. Add `@linaria` to babel presets.
```js
module.exports = {
  presets: [
    ['@anansi', { typing: 'typescript' }],
    '@linaria',
  ],
};
```
