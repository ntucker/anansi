# @anansi/webpack-config
A webpack configuration for fast development and production ready optimizations

## Usage

/webpack.config.babel.js

```javascript
import { makeConfig } from '@anansi/webpack-config'

export const options = {
  basePath: 'src',
  buildDir: 'generated_assets/',
}

export default makeConfig(options)
```

/package.json
```json
{
  "scripts": {
    "start:dev": "webpack-dev-server --config=webpack.config.babel.js --mode=development",
    "build": "webpack --config=webpack.config.babel.js --mode=production"
  }
}
```


## Support

* SCSS with CSS modules
  * Use `${basePath}/style/export.scss` to add variables or mixins avaiable in all scss files
  * Put global styles within `${basePath}/style`
  * Other styles will be treated as css modules
* Web workers
* All font formats
* Any media files
* And of course javascript
