import path from 'path';
import StatsPlugin from 'stats-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import semver from 'semver';

import { ROOT_PATH } from './constants';
import { NODE_ALIAS } from './node-polyfill';

export { default as getStyleRules } from './scss';
export { ROOT_PATH };

const WEBPACK_PUBLIC_HOST = process.env.WEBPACK_PUBLIC_HOST || '';
const WEBPACK_PUBLIC_PATH = process.env.WEBPACK_PUBLIC_PATH || '/';

export default function makeBaseConfig({
  rootPath,
  basePath,
  libraryInclude,
  libraryExclude,
  babelRoot,
  buildDir,
  mode,
  manifestFilename,
  babelLoader: babelLoaderOptions,
  extraJsLoaders,
  linariaOptions,
}) {
  const react = require(require.resolve('react', {
    paths: [rootPath],
  }));
  const babelLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      cwd: path.resolve(process.cwd(), babelRoot),
      cacheDirectory: true,
      cacheCompression: mode === 'production',
      compact: mode === 'production',
      ...babelLoaderOptions,
    },
  };
  if (react) {
    babelLoader.options.caller = {
      hasJsxRuntime: semver.gte(react.version, '16.14.0'),
      ...babelLoader.options.caller,
    };
  }

  if (linariaOptions !== false) {
    if (linariaOptions === undefined) {
      linariaOptions = {
        sourceMap: mode !== 'production',
      };
    }
    extraJsLoaders = [
      {
        loader: require.resolve('@linaria/webpack-loader'),
        options: linariaOptions,
      },
      ...extraJsLoaders,
    ];
  }

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
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename], // you may omit this when your CLI automatically adds it
      },
    },
    plugins: [
      new StatsPlugin(manifestFilename, {
        chunkModules: false,
        source: false,
        chunks: false,
        modules: false,
        assets: true,
      }),
      new MiniCssExtractPlugin({
        filename:
          mode !== 'production' ? '[name].css' : '[name].[contenthash].css',
        chunkFilename:
          mode !== 'production' ? '[name].css' : '[name].[contenthash].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.worker\.(t|j)s$/,
          use: [
            babelLoader,
            {
              loader: require.resolve('worker-loader'),
              options: { inline: 'fallback' },
            },
          ],
          include: [
            new RegExp(basePath),
            path.join(rootPath, 'stories'),
            /.storybook/,
            libraryInclude,
          ],
          exclude: libraryExclude,
        },
        {
          test: /\.(t|j)sx?$/,
          use: [
            require.resolve('thread-loader'),
            babelLoader,
            ...extraJsLoaders,
          ],
          include: [
            new RegExp(basePath),
            path.join(rootPath, 'stories'),
            /.storybook/,
            libraryInclude,
          ],
          exclude: libraryExclude,
        },
        {
          test: /\.(md|txt)$/,
          use: require.resolve('raw-loader'),
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          issuer: /\.(j|t)sx?$/,
          use: [
            {
              loader: require.resolve('@svgr/webpack'),
              options: {
                // this is handled by svgo-loader
                svgo: false,
              },
            },
            {
              loader: require.resolve('file-loader'),
              options: {
                name:
                  mode === 'production'
                    ? '[name].[contenthash].[ext]'
                    : '[path][contenthash].[ext]',
              },
            },
          ],
        },
        // for non-js files always use file-loader
        {
          test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/,
          issuer: {
            not: [/\.(j|t)sx?$/],
          },
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                name:
                  mode === 'production'
                    ? '[name].[contenthash].[ext]'
                    : '[path][contenthash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(apng|png|jpg|gif|ico|webp|avif|cur|ani|otf|eot|woff2|woff|ttf)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                name:
                  mode === 'production'
                    ? '[name].[contenthash].[ext]'
                    : '[path][contenthash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(pdf|mp4|webm|wav|mp3|m4a|aac|oga)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                name:
                  mode === 'production'
                    ? '[name].[contenthash].[ext]'
                    : '[path][contenthash].[ext]',
              },
            },
          ],
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
      alias: NODE_ALIAS,
    },
    devtool: 'source-map',
    stats: {
      children: false,
      chunks: false,
      excludeAssets: [/\.map/],
    },
  };
}
