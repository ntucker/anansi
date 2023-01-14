import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import logging from 'webpack/lib/logging/runtime';

import { getStyleRules } from './base';
import getHttpsConfig from './getHttpsConfig';
import ErrorOverlayPlugin from './plugins/ErrorOverlayPlugin';

const chalk = require('react-dev-utils/chalk');

export default function makeDevConfig(
  baseConfig,
  {
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    htmlOptions = { title: 'Anansi app', scriptLoading: 'defer' },
    argv = {},
    // eslint-disable-next-line no-unused-vars
    env = {},
    sassOptions,
    sassResources,
    cssModulesOptions,
    globalStyleDir,
    isStackblitz,
  },
) {
  const config = { ...baseConfig };

  config.mode = 'development';
  // https://webpack.js.org/guides/build-performance/#output-without-path-info
  config.output.pathinfo = false;
  config.output.devtoolModuleFilenameTemplate = info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
  config.optimization = {
    // https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    // save perf when errors occur
    emitOnErrors: false,
    // https://webpack.js.org/guides/build-performance/#minimal-entry-chunk
    runtimeChunk: true,
  };

  const watchIgnorePaths = [
    /(hot-update\.[^.]|\.map|s?css\.d\.ts)$/,
    path.join(rootPath, '.cache'),
    /node_modules\/\.cache(?!\/(\.linaria-(cache|development|production)\/))/,
  ];
  config.plugins = [
    new webpack.WatchIgnorePlugin({ paths: watchIgnorePaths }),
    ...config.plugins,
  ];
  // not for server builds
  if (!argv?.target?.includes?.('node')) {
    config.plugins.unshift(new HtmlWebpackPlugin(htmlOptions));
  }
  let server = 'http';
  try {
    server = getHttpsConfig(rootPath);
  } catch (e) {
    console.warn(chalk.yellow('Falling back to http'));
  }
  config.devServer = {
    hot: true,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    allowedHosts: ['localhost', '127.0.0.1'],
    server,
    devMiddleware: {
      publicPath: config.output.publicPath,
      stats: {
        preset: 'minimal',
        children: 'errors-only',
        excludeAssets: [/\.map/],
      },
    },
    client: {
      logging: 'warn',
      overlay: false, // we have our own overlay, so ignore this
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: argv.port,
      },
    },
    historyApiFallback: true,
    // TODO: add proxy options
  };
  config.devtool = 'cheap-module-source-map';
  // if we know the port, force it in case this is encapsulated in another host
  if (argv.port) {
    config.output.publicPath = `http://localhost:${argv.port}${config.output.publicPath}`;
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  if (
    process.env.NO_HOT_RELOAD !== 'true' &&
    process.env.NO_HOT_RELOAD !== true &&
    !argv?.target?.includes?.('node')
  ) {
    try {
      require('react-refresh/babel');
      const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
      config.plugins.push(
        // these are needed by the react-dev-utils overlay
        new webpack.EnvironmentPlugin({
          WDS_SOCKET_HOST: '',
          WDS_SOCKET_PATH: '',
          WDS_SOCKET_PORT: '',
          FAST_REFRESH: true,
        }),
        new ReactRefreshWebpackPlugin({
          overlay: {
            // provides editor opening when combined with ErrorOverlayPlugin
            entry: require.resolve('./plugins/ErrorOverlayEntry'),
            // registers error handlers
            module: require.resolve('./plugins/refreshOverlayModule'),
            sockHost: config.devServer.client.webSocketURL.hostname,
            sockPath: config.devServer.client.webSocketURL.pathname,
            sockPort: config.devServer.client.webSocketURL.port,
          },
        }),
        new ErrorOverlayPlugin(),
      );
      config.devServer.hot = 'only';
      logging
        .getLogger('anansi')
        .info('React fast refresh detected and enabled');
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  if (!config.experiments) {
    config.experiments = {};
  }
  // this doesn't work well with webcontainers
  if (!isStackblitz) {
    // TODO: enable once we can figure out how to make it work with manifest and await for SSR
    //config.experiments.lazyCompilation = { entries: false };
  }

  const styleRules = getStyleRules({
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    cssModulesOptions: {
      localIdentName: '[folder]_[name]__[local]___[xxhash64:hash:base64:5]',
      ...cssModulesOptions,
    },
    sassOptions,
    sassResources,
    globalStyleDir,
    target: argv?.target,
  });
  config.module.rules = [...config.module.rules, styleRules];
  return config;
}
