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
      env: [process.env.NODE_ENV, process.env.BROWSERSLIST_ENV].join(','),
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
