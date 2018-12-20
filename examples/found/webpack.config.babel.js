import { makeConfig } from '@anansi/webpack-config'

export const options = {
  libraryInclude: /node_modules\/(@anansi\/)/,
  libraryExclude: /node_modules(?!\/(@anansi\/))/,
  basePath: 'src',
  buildDir: 'generated_assets/',
}

export default makeConfig(options)