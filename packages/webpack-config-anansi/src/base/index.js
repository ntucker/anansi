import path from 'path';
import StatsPlugin from 'stats-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { ROOT_PATH } from './constants';
import { NODE_ALIAS } from './node-polyfill';
import { generateBabelLoader } from './generateBabelLoader';
import { version } from '../../package.json';
export { default as getStyleRules } from './css';
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
  tsconfigPathsOptions,
  svgrOptions,
  globalStyleDir,
  nohash,
  argv,
}) {
  const babelLoader = generateBabelLoader({
    rootPath,
    babelRoot,
    target: argv?.target,
    mode,
    babelLoaderOptions,
  });

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

  const modules = [path.join(rootPath, basePath), 'node_modules'];
  if (globalStyleDir) {
    modules.splice(1, 0, path.join(rootPath, basePath, globalStyleDir));
  }

  return {
    context: rootPath,
    entry: {
      App: [`./${basePath}`],
    },
    output: {
      path: path.join(rootPath, buildDir),
      publicPath: WEBPACK_PUBLIC_HOST + WEBPACK_PUBLIC_PATH,
      filename: nohash ? '[name].js' : '[name]-[contenthash].js',
      chunkFilename: nohash
        ? '[name].chunk.js'
        : '[name]-[contenthash].chunk.js',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename], // you may omit this when your CLI automatically adds it
      },
      version: JSON.stringify({
        version,
        env: [process.env.NODE_ENV, process.env.BROWSERSLIST_ENV].join(','),
      }),
      cacheDirectory: path.resolve(rootPath, '.cache/webpack'),
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
          (mode !== 'production') | nohash
            ? '[name].css'
            : '[name].[contenthash].css',
        chunkFilename:
          (mode !== 'production') | nohash
            ? '[name].css'
            : '[name].[contenthash].css',
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
        // transpile JS outside the app to support standard ES features
        {
          test: /\.m?js$/,
          include: /node_modules/,
          exclude: [
            // \\ for Windows, / for Mac OS and Linux
            /node_modules[\\/](core-js)/,
            /node_modules[\\/]webpack[\\/]buildin/,
            /@babel(?:\/|\\{1,2})runtime/,
          ],
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              cacheDirectory: true,
              // See https://github.com/facebook/create-react-app/issues/6846 for context
              cacheCompression: false,
              // Babel assumes ES Modules, which isn't safe until CommonJS
              // dies. This changes the behavior to assume CommonJS unless
              // an `import` or `export` is present in the file.
              // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
              sourceType: 'unambiguous',
              presets: [
                [
                  '@babel/preset-env',
                  {
                    bugfixes: true,
                    useBuiltIns: 'entry',
                    corejs: 3,
                    exclude: ['transform-typeof-symbol'],
                  },
                ],
              ],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: true,
                    version: require('@babel/runtime/package.json').version,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.html$/,
          use: [{ loader: require.resolve('html-loader') }],
        },
        {
          test: /\.(md|txt)$/,
          type: 'asset/source',
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          issuer: /\.(j|t)sx?$/,
          use: [
            {
              loader: require.resolve('@svgr/webpack'),
              options: {
                ...svgrOptions,
                // this is handled by svgo-loader
                svgo: false,
              },
            },
            {
              loader: require.resolve('file-loader'),
              options: {
                name: nohash
                  ? '[name].[ext]'
                  : mode === 'production'
                  ? '[name].[contenthash].[ext]'
                  : '[path][contenthash].[ext]',
              },
            },
          ],
          type: 'javascript/auto',
        },
        // for non-js files always use file-loader
        {
          test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/,
          issuer: {
            not: [/\.(j|t)sx?$/],
          },
          type: 'asset',
          generator: {
            emit: !argv?.target?.includes?.('node'),
          },
        },
        {
          test: /\.(apng|png|jpg|gif|ico|webp|avif|cur|ani|otf|eot|woff2|woff|ttf)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset',
          generator: {
            emit: !argv?.target?.includes?.('node'),
          },
        },
        {
          test: /\.(pdf|mp4|webm|wav|mp3|m4a|aac|oga)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            emit: !argv?.target?.includes?.('node'),
          },
        },
      ],
    },
    resolve: {
      modules,
      extensions: ['.wasm', '.mjs', '.js', '.ts', '.tsx', '.scss', '.json'],
      alias: NODE_ALIAS,
      plugins:
        tsconfigPathsOptions !== false
          ? [new TsconfigPathsPlugin(tsconfigPathsOptions)]
          : [],
    },
    devtool: 'source-map',
    stats: {
      children: false,
      chunks: false,
      excludeAssets: [/\.map/],
    },
  };
}
