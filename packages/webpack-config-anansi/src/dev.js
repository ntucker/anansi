import HtmlWebpackPlugin from 'html-webpack-plugin';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import { map } from 'ramda';

import { getStyleRules } from './base';

export default function makeDevConfig(
  baseConfig,
  {
    basePath,
    libraryInclude,
    libraryExclude,
    buildDir,
    htmlOptions = { title: 'Anansi app' },
  },
) {
  const config = { ...baseConfig };

  config.mode = 'development';
  config.output.pathinfo = true;
  config.output.filename = '[name]-[hash].js';
  config.output.chunkFilename = '[name]-[hash].chunk.js';
  config.output.devtoolModuleFilenameTemplate = info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
  config.watch = true;
  config.optimization = {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  };

  // hot reloading sometimes messed up polyfills, so just place this at the start
  config.entry = map(entry => ['@babel/polyfill'].concat(entry), config.entry);

  config.plugins = [
    new ErrorOverlayPlugin(),
    new HtmlWebpackPlugin(htmlOptions),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.WatchIgnorePlugin([/s?css\.d\.ts$/]),
    ...config.plugins,
  ];
  config.devServer = {
    hot: true,
    port: 3000,
    clientLogLevel: 'warning',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: ['localhost', '127.0.0.1'],
    stats: 'minimal',
    overlay: true,
    open: true,
    historyApiFallback: {
      rewrites: [{ from: /./, to: `/assets/${buildDir}index.html` }],
    },
    // TODO: add proxy options
  };
  config.devtool = '#cheap-module-source-map';
  config.output.publicPath = `http://localhost:3000/assets/${buildDir}`;
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  try {
    require('@hot-loader/react-dom');
    config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
  } catch(e) {}


  const styleRules = getStyleRules({
    basePath,
    libraryInclude,
    libraryExclude,
    cssLoaderOptions: {
      localIdentName: '[folder]_[name]__[local]___[hash:base64:5]',
    },
  });
  config.module.rules = [...config.module.rules, ...styleRules];
  return config;
}
