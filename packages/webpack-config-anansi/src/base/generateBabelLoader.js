import * as babel from '@babel/core';
import { version as babelCoreVersion } from '@babel/core/package.json';
import { version as babelLoaderVersion } from 'babel-loader/package.json';
import path from 'path';
import semver from 'semver';

import { version } from '../../package.json';

export function generateBabelLoader({
  rootPath,
  babelRoot,
  target,
  mode,
  babelLoaderOptions,
  noHotReload,
  library,
}) {
  const react = require(
    require.resolve('react', {
      paths: [rootPath],
    }),
  );
  let hasReactRefresh;
  try {
    require('react-refresh/babel');
    hasReactRefresh = true;
  } catch (e) {
    hasReactRefresh = false;
  }
  const hasJsxRuntime =
    react ?
      (!target?.includes?.('node') && semver.gte(react.version, '16.14.0')) ||
      semver.gte(react.version, '18.0.0')
    : false;
  const cwd = path.resolve(process.cwd(), babelRoot);
  const filename = path.join(cwd, 'noop.js');
  // Environment variables that affect babel output (see babel-preset-anansi)
  const envVars = [
    process.env.NODE_ENV,
    process.env.BROWSERSLIST_ENV,
    process.env.BABEL_ENV,
    process.env.BABEL_MODULES,
    process.env.BABEL_POLYFILL_METHOD,
    process.env.NO_HOT_RELOAD,
    process.env.TS_CONFIG_PATH,
    process.env.RESOLVER_ALIAS,
    process.env.RESOLVER_ROOT,
    process.env.ROOT_PATH_ROOT,
    process.env.ROOT_PATH_SUFFIX,
    process.env.ROOT_PATH_PREFIX,
    process.env.POLYFILL_TARGETS,
    // avoid collisions while being minimal and performant
  ].join('\0');

  const cacheIdentifier =
    JSON.stringify({
      version,
      target,
      mode,
      hasReactRefresh,
      noHotReload,
      hasJsxRuntime,
      babelCoreVersion,
      babelLoaderVersion,
      envVars,
    }) +
    JSON.stringify(
      babel.loadPartialConfig({
        filename,
        cwd,
        sourceFileName: filename,
      }).options,
    );
  const babelLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      cwd,
      cacheDirectory: true,
      cacheIdentifier,
      cacheCompression: mode === 'production',
      compact: mode === 'production',
      ...babelLoaderOptions,
    },
  };
  if (react) {
    babelLoader.options.caller = {
      hasJsxRuntime,
      ...babelLoader.options.caller,
    };
    if (noHotReload) {
      babelLoader.options.caller.noHotReload = true;
    }
  }
  if (library) {
    babelLoader.options.caller.library = true;
  }
  return babelLoader;
}
