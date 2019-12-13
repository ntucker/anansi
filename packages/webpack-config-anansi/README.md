# @anansi/webpack-config

A webpack configuration for fast development and production ready optimizations

## Usage

`/webpack.config.js`

```javascript
const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: 'src',
  buildDir: 'generated_assets/',
};

module.exports = { options };

module.exports = makeConfig(options);
```

`/package.json`

```json
{
  "scripts": {
    "start:dev": "webpack-dev-server --mode=development",
    "build": "webpack --mode=production",
    "analyze": "webpack --mode=production --analyze",
    "pkgcheck": "webpack --check=nobuild"
  }
}
```

### Storybook

`/.storybook/webpack.config.js`

```js
const { makeStorybookConfigGenerator } = require('@anansi/webpack-config');
const { options } = require('../webpack.config');

module.exports = makeStorybookConfigGenerator(options);
```

## Enabling react-refresh

Install react-refresh as a dev-dependency in your project and it will automatically
be detected and enabled. Be sure to use the anansi babel or include `react-refresh/babel` in
your own babel configuration.

```bash
yarn add --dev react-refresh
```

## CMD line arguments

### analyze

If set, will build a static [treemap visualization of your packages](https://www.npmjs.com/package/webpack-bundle-analyzer). Highly recommended to run in production mode to get accurate results.

### check

If set will run package checks to check for duplicates or ciruclar dependencies. Set equal to 'nobuild' for a standalone run where build output is not needed.

Examples:
`webpack --mode=production --check` or `webpack --check=nobuild`

### profile

If set, will enable [React DevTools Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html). This feature is only available in production mode since it is enabled in development by default.

## ENV customization

### WEBPACK_PUBLIC_HOST = ''

Sets domain of served files. This is useful to distinguish between different build environments that
will serve assets from different locations like a CDN.

Serves as first half of [publicPath](https://webpack.js.org/guides/public-path/)

Note: dev mode sets its own path based assets serving is completely controlled by webpack-dev-server.

### WEBPACK_PUBLIC_PATH = '/'

Forms the second half of the [publicPath](https://webpack.js.org/guides/public-path/). Can be useful when assets are served in subdirectories as
opposed to custom domains like in the case of CDNs.

## Options

Pass these to makeConfig.

### libraryInclude/libraryExclude

Regex to match libraries to include in the normal build process. This is useful for
locally developed modules or `yarn workspaces`. Not this should point to the installed
location, rather than the actual target. Note you'll need both the positive and negative
regexes.

libraryExclude defaults to `/node_modules/`, which will exclude libraries from expensive
and potentially incorrect processing from babel loaders.

To match all libraries in namespace `@myspacespace`:

```js
const myConfig = makeConfig({
  libraryInclude: /node_modules\/(@mynamespace\/)/,
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

## babelRoot = \$CWD

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

### bundleAnalyzerOptions

Customize how to [analyze](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin) your bundles

### hardCacheOptions = {}

Customize how [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin) works. Set
to `false` to disable plugin. This plugin often speeds up development, but can sometimes cause compatibility issues.
Disable it if you experience such problems.

### manifestFilename = 'manifest.json'

Determines the filename for the stats file that includes mappings to all filenames.

## File Support

- SCSS with CSS modules
  - Use `${basePath}/style/export.scss` to add variables or mixins avaiable in all scss files
  - Put global styles within `${basePath}/style`
  - Other styles will be treated as css modules
- Web workers
- All font formats
- Any media files
- Javascript & Typescript
