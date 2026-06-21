import path from 'path';

import { ROOT_PATH } from './constants';

// Builds the shared base configuration: source/entry, output, resolve, html,
// performance, and the cache that Rsbuild uses by default.
//
// The returned object is later merged with mode/target-specific fragments by
// makeConfig.
export function makeBase({
  rootPath,
  basePath,
  buildDir,
  manifestFilename,
  htmlOptions,
  tsconfigPathsOptions,
  globalStyleDir,
  nohash,
  target,
  library,
}) {
  const WEBPACK_PUBLIC_HOST = process.env.WEBPACK_PUBLIC_HOST || '';
  const WEBPACK_PUBLIC_PATH = process.env.WEBPACK_PUBLIC_PATH || '/';
  const isNodeTarget = target === 'node';

  const includes = [path.join(rootPath, basePath)];
  if (globalStyleDir) {
    includes.unshift(path.join(rootPath, basePath, globalStyleDir));
  }

  const config = {
    root: rootPath,
    source: {
      entry: { App: path.join(rootPath, basePath) },
      include: includes,
      tsconfigPath:
        tsconfigPathsOptions === false ? undefined : (
          (tsconfigPathsOptions?.configFile ?? undefined)
        ),
    },
    output: {
      target: isNodeTarget ? 'node' : 'web',
      distPath: { root: path.join(rootPath, buildDir) },
      assetPrefix: WEBPACK_PUBLIC_HOST + WEBPACK_PUBLIC_PATH,
      filename: {
        js: nohash || isNodeTarget ? '[name].js' : '[name].[contenthash:10].js',
        css: nohash ? '[name].css' : '[name].[contenthash:10].css',
      },
      manifest: manifestFilename ?? 'manifest.json',
      legalComments: 'none',
    },
    performance: {
      profile: false,
    },
    html:
      htmlOptions === false ? undefined : (
        {
          template: htmlOptions?.template,
          title: htmlOptions?.title ?? 'Anansi app',
          ...(htmlOptions ?? {}),
        }
      ),
    server: {
      printUrls: false,
    },
  };

  if (htmlOptions === false || isNodeTarget) {
    delete config.html;
  }

  if (library) {
    config.output.target = isNodeTarget ? 'node' : 'web';
    config.output.library = {
      type:
        typeof library === 'object' && library?.type ?
          library.type
        : 'commonjs2',
    };
  }

  return config;
}

export { ROOT_PATH };
