import * as babel from '@babel/core';
import { version as babelCoreVersion } from '@babel/core/package.json';
import { version as babelLoaderVersion } from 'babel-loader/package.json';
import path from 'path';
import semver from 'semver';

import { version } from '../package.json';

// Generates the babel-loader options that match the existing
// @anansi/webpack-config pipeline. Used both by @rsbuild/plugin-babel and
// @wyw-in-js/webpack-loader so behaviour stays consistent across passes.
export function generateBabelOptions({
  rootPath,
  babelRoot,
  target,
  mode,
  babelLoaderOptions,
  noHotReload,
  library,
}) {
  let react;
  try {
    react = require(
      require.resolve('react', {
        paths: [rootPath],
      }),
    );
  } catch {
    react = undefined;
  }

  let hasReactRefresh;
  try {
    require('react-refresh/babel');
    hasReactRefresh = true;
  } catch {
    hasReactRefresh = false;
  }

  const isNodeTarget = target === 'node';
  const hasJsxRuntime =
    react ?
      (!isNodeTarget && semver.gte(react.version, '16.14.0')) ||
      semver.gte(react.version, '18.0.0')
    : false;

  const cwd = path.resolve(process.cwd(), babelRoot ?? '');
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
  ].join('\0');

  const partial = babel.loadPartialConfig({
    filename,
    cwd,
    sourceFileName: filename,
  });
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
    }) + JSON.stringify(partial?.options ?? {});

  const options = {
    cwd,
    cacheDirectory: true,
    cacheIdentifier,
    cacheCompression: mode === 'production',
    compact: mode === 'production',
    ...babelLoaderOptions,
  };
  if (react) {
    options.caller = {
      hasJsxRuntime,
      ...options.caller,
    };
    if (noHotReload) {
      options.caller.noHotReload = true;
    }
  }
  if (library) {
    options.caller = options.caller || {};
    options.caller.library = true;
  }
  return options;
}
