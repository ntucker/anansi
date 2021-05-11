import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

import WatchMissingNodeModulesPlugin from './plugins/WatchMissingNodeModulesPlugin';
import { getStyleRules } from './base';

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
    sassResources,
    cssModulesOptions,
    globalStyleDir,
  },
) {
  // Need explicit target to make hotreloading work until https://github.com/webpack/webpack-dev-server/issues/2758
  // is released in webpack-dev-server v4
  const config = { target: 'web', ...baseConfig };

  config.mode = 'development';
  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].chunk.js';
  config.output.devtoolModuleFilenameTemplate = info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
  config.optimization = {
    splitChunks: false,
    emitOnErrors: false,
  };

  const watchIgnorePaths = [/(hot-update\.[^.]|\.map|s?css\.d\.ts)$/];
  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin(path.join(rootPath, 'node_modules')),
    new webpack.WatchIgnorePlugin({ paths: watchIgnorePaths }),
    ...config.plugins,
  ];
  // not for server builds
  if (!argv?.target?.includes?.('node')) {
    // error overlay is broken in webpack 5; TODO add back when it works again
    // config.plugins.unshift(new ErrorOverlayPlugin());
    config.plugins.unshift(new HtmlWebpackPlugin(htmlOptions));
  }
  config.devServer = {
    hot: true,
    publicPath: config.output.publicPath,
    clientLogLevel: 'warning',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    },
    allowedHosts: ['localhost', '127.0.0.1'],
    stats: 'minimal',
    overlay: true,
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
  try {
    require('react-refresh/babel');
    const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
    config.plugins.push(new ReactRefreshWebpackPlugin({}));
    config.devServer.hotOnly = true;
    console.log('Fast refresh detected and enabled');
    // eslint-disable-next-line no-empty
  } catch (e) {}

  const styleRules = getStyleRules({
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    cssModulesOptions: {
      localIdentName: '[folder]_[name]__[local]___[hash:base64:5]',
      ...cssModulesOptions,
    },
    sassResources,
    globalStyleDir,
    target: argv?.target,
  });
  config.module.rules = [...config.module.rules, ...styleRules];
  return config;
}
