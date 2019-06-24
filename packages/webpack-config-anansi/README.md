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

## CMD line arguments

### analyze

If set, will build a static [treemap visualization of your packages](https://www.npmjs.com/package/webpack-bundle-analyzer). Highly recommended to run in production mode to get accurate results.

### check

If set will run package checks to check for duplicates or ciruclar dependencies. Set equal to 'nobuild' for a standalone run where build output is not needed.

Examples:
`webpack --mode=production --check` or `webpack --check=nobuild`

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

```
const myConfig = makeConfig({
  libraryInclude: /node_modules\/(@mynamespace\/)/,
  libraryExclude: /node_modules(?!\/(@mynamespace\/))/,
})
```

### basePath = 'src'

Marks the base directory inside the package for javascript source files. This
is used to make it easy to import from the root.

Example:

```
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

### rootPath = $CWD

Root path should be the root path of your project. Usually where your package.json and webpack.config.js are.
This defaults to the current working directory you are running commands from. However, if you need to run things
from another directory, you can send __dirname into this option from your webpack.config.js.

### buildDir = 'generated_assets/'

Output directory for production build files

### serverDir: 'server_assets/'

Output directory for production server builds. Used when using `--target=node` cli option.

### mode: argv?.mode || process.env.NODE_ENV

Override the [mode](https://www.google.com/search?q=webpack+mode&oq=webpack+mode&aqs=chrome..69i57j69i60l3j0l2.1349j0j7&sourceid=chrome&ie=UTF-8)

### bundleAnalyzerOptions

Customize how to [analyze](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin) your bundles

## File Support

- SCSS with CSS modules
  - Use `${basePath}/style/export.scss` to add variables or mixins avaiable in all scss files
  - Put global styles within `${basePath}/style`
  - Other styles will be treated as css modules
- Web workers
- All font formats
- Any media files
- Javascript & Typescript
