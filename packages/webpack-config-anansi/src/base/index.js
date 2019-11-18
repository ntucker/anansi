import path from 'path';
import StatsPlugin from 'stats-webpack-plugin';

import { ROOT_PATH, LIBRARY_MODULES_PATH } from './constants';

export { default as getStyleRules } from './scss';
export { ROOT_PATH };

const WEBPACK_PUBLIC_HOST = process.env.WEBPACK_PUBLIC_HOST || '';
const WEBPACK_PUBLIC_PATH = process.env.WEBPACK_PUBLIC_PATH || '/';

export default function makeBaseConfig({
  rootPath,
  basePath,
  libraryInclude,
  libraryExclude,
  buildDir,
  mode,
  manifestFilename,
}) {
  const babelLoader = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      cacheCompression: mode === 'production',
      compact: mode === 'production',
    },
  };

  return {
    context: rootPath,
    entry: {
      App: [`./${basePath}`],
    },
    output: {
      path: path.join(rootPath, buildDir),
      publicPath: WEBPACK_PUBLIC_HOST + WEBPACK_PUBLIC_PATH,
      filename: '[name]-[contenthash].js',
      chunkFilename: '[name]-[contenthash].chunk.js',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    target: 'web',
    plugins: [
      new StatsPlugin(manifestFilename, {
        chunkModules: false,
        source: false,
        chunks: false,
        modules: false,
        assets: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.worker\.(t|j)s$/,
          use: [babelLoader, { loader: 'worker-loader', options: { inline: true } }],
          include: [new RegExp(basePath), path.join(rootPath, 'stories'), /.storybook/, libraryInclude],
          exclude: libraryExclude,
        },
        {
          test: /\.(t|j)sx?$/,
          use: ['thread-loader', babelLoader],
          include: [new RegExp(basePath), path.join(rootPath, 'stories'), /.storybook/, libraryInclude],
          exclude: libraryExclude,
        },
        {
          test: /\.(md|txt)$/,
          use: 'raw-loader',
        },
        {
          test: /\.(png|jpg|gif|ico|pdf|webm|webp|mp4|otf|eot|woff2|woff|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name:
                  mode === 'production'
                    ? '[name].[hash].[ext]'
                    : '[path][name].[ext]',
              },
            },
          ],
        },
        {
          test: /file\.svg$/,
          use: [{ loader: 'file-loader' }],
        },
        {
          test: /\.svg$/,
          use: [{ loader: 'svg-react-loader' }],
        },
      ],
    },
    resolve: {
      modules: [
        path.join(rootPath, basePath),
        path.join(rootPath, basePath, 'style'),
        'node_modules',
      ],
      extensions: ['.js', '.ts', '.tsx', '.scss', '.json'],
      symlinks: false,
    },
    // include the loaders installed by this library
    resolveLoader: {
      modules: ['node_modules', LIBRARY_MODULES_PATH],
      extensions: ['.js', '.ts', '.tsx', '.json'],
      mainFields: ['loader', 'main'],
    },
    devtool: '#source-map',
    stats: {
      children: false,
      chunks: false,
      excludeAssets: [/\.map/],
    },
  };
}
