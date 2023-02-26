import { create as createResolve } from 'enhanced-resolve';
import webpack from 'webpack';

const resolve = createResolve.sync({
  modules: ['.'],
  // or resolve.create.sync
  extensions: ['.js', '.cjs', '.mjs'],
  // see more options below
});

export function getWebpackConfig(): (
  env: any,
  argv: any,
) => webpack.Configuration {
  const configPath = resolve({}, process.cwd(), 'webpack.config');
  if (!configPath) {
    throw new Error('Cannot find webpack.config in ' + process.cwd());
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const webpackConfig = require(configPath);
  return webpackConfig;
}
