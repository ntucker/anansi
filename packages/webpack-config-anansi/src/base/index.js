import path from 'path';
import { always } from 'ramda';
import BundleTracker from 'webpack-bundle-tracker';

import { ROOT_PATH, LIBRARY_MODULES_PATH } from './constants';


export { default as getStyleRules } from './scss';
export { ROOT_PATH };

export default function makeBaseConfig({
  basePath = 'src',
  libraryInclude = always(false),
  libraryExclude,
  buildDir = 'generated_assets/',
}) {
  return {
    context: ROOT_PATH,
    entry: {
      App: [`./${basePath}/index.js`],
    },
    output: {
      path: path.join(ROOT_PATH, buildDir),
      filename: '[name]-[contenthash].js',
      chunkFilename: '[name]-[contenthash].chunk.js',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    target: 'web',
    plugins: [new BundleTracker({ filename: 'webpack-stats.json' })],
    module: {
      rules: [
        {
          test: /\.worker\.(t|j)s$/,
          use: ['babel-loader', 'worker-loader'],
          include: [new RegExp(basePath), /.storybook/, libraryInclude],
          exclude: libraryExclude,
        },
        {
          test: /\.(t|j)sx?$/,
          use: 'babel-loader',
          include: [new RegExp(basePath), /.storybook/, libraryInclude],
          exclude: libraryExclude,
        },
        {
          test: /\.(png|jpg|gif|ico|pdf|webm|mp4|svg)$/,
          use: 'file-loader',
        },
        {
          test: /\.(md|txt)$/,
          use: 'raw-loader',
        },
        {
          test: /\.(otf|eot|woff2?|ttf)$/,
          use: 'file-loader',
        },
        {
          test: /\.isvg$/,
          use: 'svg-react-loader',
        },
      ],
    },
    resolve: {
      modules: [
        path.join(ROOT_PATH, basePath),
        path.join(ROOT_PATH, basePath, 'style'),
        'node_modules',
      ],
      extensions: ['.js', '.ts', '.tsx', '.scss'],
      symlinks: false,
    },
    // include the loaders installed by this library
    resolveLoader: {
      modules: ['node_modules', LIBRARY_MODULES_PATH],
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main'],
    },
    devtool: '#source-map',
    stats: {
      children: false,
      chunks: false,
    },
  };
}
