import HtmlWebpackPlugin from 'html-webpack-plugin';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
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
  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].chunk.js';
  config.output.devtoolModuleFilenameTemplate = info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
  config.watch = true;
  config.optimization = {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  };

  config.plugins = [
    new HardSourceWebpackPlugin(),
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
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    },
    allowedHosts: ['localhost', '127.0.0.1'],
    stats: 'minimal',
    overlay: true,
    open: true,
    historyApiFallback: {
      rewrites: [{ from: /^((?!\/assets).)*/, to: `/assets/${buildDir}index.html` }],
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
  } catch (e) {}

  const styleRules = getStyleRules({
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
