# @anansi/webpack-config
A webpack configuration for fast development and production ready optimizations

## Usage

/webpack.config.js

```javascript
const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: 'src',
  buildDir: 'generated_assets/',
}

module.exports = makeConfig(options)
```

/package.json
```json
{
  "scripts": {
    "start:dev": "webpack-dev-server --mode=development",
    "build": "webpack --mode=production",
    "analyze": "WEBPACK_ANALYZE=true webpack --mode=production"
  }
}
```

## Env customization

### WEBPACK_ANALYZE

Set `WEBPACK_ANALYZE` to "true" to build a static [treemap visualization of your packages](https://www.npmjs.com/package/webpack-bundle-analyzer).

/package.json
```json
{
  "scripts": {
    "analyze": "WEBPACK_ANALYZE=true webpack --mode=production"
  }
}
```

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
import fetch from 'network'
```
from any file.

### buildDir = 'generated_assets/'

Output directory for production build files

## File Support

* SCSS with CSS modules
  * Use `${basePath}/style/export.scss` to add variables or mixins avaiable in all scss files
  * Put global styles within `${basePath}/style`
  * Other styles will be treated as css modules
* Web workers
* All font formats
* Any media files
* And of course javascript
