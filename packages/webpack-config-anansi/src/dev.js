import HtmlWebpackPlugin from 'html-webpack-plugin';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import webpack from 'webpack';
import path from 'path';

import { getStyleRules } from './base';

export default function makeDevConfig(
  baseConfig,
  {
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    buildDir,
    hardCacheOptions,
    htmlOptions = { title: 'Anansi app' },
    argv = {},
  },
) {
  const config = { ...baseConfig };

  config.mode = 'development';
  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].chunk.js';
  config.output.devtoolModuleFilenameTemplate = info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
  config.watch = true;
  config.optimization = {
    splitChunks: false,
  };

  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin(path.join(rootPath, 'node_modules')),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.WatchIgnorePlugin([/s?css\.d\.ts$/]),
    ...config.plugins,
  ];
  // not for server builds
  if (argv?.target !== 'node') {
    config.plugins.unshift(
      new ErrorOverlayPlugin(),
      new HtmlWebpackPlugin(htmlOptions),
    );
  }
  if (hardCacheOptions) {
    config.plugins.unshift(
      new HardSourceWebpackPlugin(hardCacheOptions),
      new HardSourceWebpackPlugin.ExcludeModulePlugin([
        {
          // HardSource works with mini-css-extract-plugin but due to how
          // mini-css emits assets, assets are not emitted on repeated builds with
          // mini-css and hard-source together. Ignoring the mini-css loader
          // modules, but not the other css loader modules, excludes the modules
          // that mini-css needs rebuilt to output assets every time.
          test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        },
      ]),
    );
  }
  config.devServer = {
    hot: true,
    clientLogLevel: 'warning',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    },
    allowedHosts: ['localhost', '127.0.0.1'],
    stats: 'minimal',
    overlay: true,
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /^((?!\/assets).)*/, to: `/assets/${buildDir}index.html` },
      ],
    },
    // TODO: add proxy options
  };
  config.devtool = '#cheap-module-source-map';
  config.output.publicPath = `/assets/${buildDir}`;
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
    config.plugins.push(new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }));
    config.devServer.hotOnly = true;
    console.log("Fast refresh detected and enabled");
  } catch (e) {}

  const styleRules = getStyleRules({
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    cssLoaderOptions: {
      modules: {
        mode: 'local',
        localIdentName: '[folder]_[name]__[local]___[hash:base64:5]',
      },
    },
  });
  config.module.rules = [...config.module.rules, ...styleRules];
  return config;
}
