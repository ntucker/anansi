import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

import { ROOT_PATH } from './constants';
import { generateBabelLoader } from './generateBabelLoader';
import { NODE_ALIAS } from './node-polyfill';
import { version } from '../../package.json';

export { default as getStyleRules } from './css';
export { ROOT_PATH };

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
  inJSOptions,
  tsconfigPathsOptions,
  svgoOptions,
  svgrOptions,
  globalStyleDir,
  nohash,
  argv,
  env,
  cssExtractOptions,
}) {
  const WEBPACK_PUBLIC_HOST = process.env.WEBPACK_PUBLIC_HOST || '';
  const WEBPACK_PUBLIC_PATH = process.env.WEBPACK_PUBLIC_PATH || '/';

  const modules = [path.join(rootPath, basePath), 'node_modules'];
  if (globalStyleDir) {
    modules.splice(1, 0, path.join(rootPath, basePath, globalStyleDir));
  }
  const resolve = {
    modules,
    extensions: ['.ts', '.tsx', '.mts', '.cts', '...'],
    extensionAlias: {
      '.js': ['.js', '.ts', '.tsx', '.jsx'],
      '.mjs': ['.mjs', '.mts'],
      '.cjs': ['.cjs', '.cts'],
    },
    fallback: NODE_ALIAS,
    plugins:
      tsconfigPathsOptions !== false ?
        [new TsconfigPathsPlugin(tsconfigPathsOptions)]
      : [],
  };

  const mainBabelLoader = generateBabelLoader({
    rootPath,
    babelRoot,
    target: argv?.target,
    mode,
    babelLoaderOptions,
  });
  const inJSBabelOptions = {
    ...mainBabelLoader.options,
  };
  delete inJSBabelOptions.cacheDirectory;
  delete inJSBabelOptions.cacheIdentifier;
  delete inJSBabelOptions.cacheCompression;

  if (inJSOptions !== false) {
    if (inJSOptions === undefined) {
      inJSOptions = {
        sourceMap: mode !== 'production',
      };
    }
    extraJsLoaders = [
      {
        loader: require.resolve('@wyw-in-js/webpack-loader'),
        options: {
          // `resolveOptions` was dropped in https://github.com/callstack/linaria/pull/1001 as it uses webpack directly
          //resolveOptions: { ...resolve },
          babelOptions: inJSBabelOptions,
          ...inJSOptions,
        },
      },
      ...extraJsLoaders,
    ];
  }

  const plugins = [
    new StatsWriterPlugin({
      filename: manifestFilename,
      stats: {
        chunkModules: false,
        source: false,
        chunks: false,
        modules: false,
        assets: true,
      },
    }),
  ];

  if (cssExtractOptions !== false) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename:
          (mode !== 'production') | nohash ?
            '[name].css'
          : '[name].[contenthash].css',
        chunkFilename:
          (mode !== 'production') | nohash ?
            '[name].css'
          : '[name].[contenthash].css',
        ...cssExtractOptions,
      }),
    );
  }

  const assetModuleFilename =
    nohash || mode !== 'production' ?
      '[name].[ext][query]'
    : '[contenthash].[ext][query]';
  const config = {
    context: rootPath,
    entry: {
      [env?.name || 'App']: [env?.entrypath || `./${basePath}`],
    },
    output: {
      path: path.join(rootPath, buildDir),
      publicPath: WEBPACK_PUBLIC_HOST + WEBPACK_PUBLIC_PATH,
      filename:
        nohash || mode !== 'production' ?
          '[name].js'
        : '[name]-[contenthash].js',
      chunkFilename:
        nohash || mode !== 'production' ?
          '[name].chunk.js'
        : '[name]-[contenthash].chunk.js',
      assetModuleFilename,
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      // this improves performance and makes this compatible across node 16 and 18 at the same time.
      hashFunction: 'xxhash64',
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename], // you may omit this when your CLI automatically adds it
      },
      version: JSON.stringify({
        version,
        target: argv?.target,
        mode,
        env: [process.env.NODE_ENV, process.env.BROWSERSLIST_ENV].join(','),
      }),
    },
    plugins: plugins,
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          include: [
            path.join(rootPath, basePath),
            path.join(rootPath, 'stories'),
            /\.storybook/,
            libraryInclude,
          ],
          exclude: libraryExclude,
          oneOf: [
            /* TODO(deprecated): Drop this once people have a chance to migrate */
            {
              test: /\.worker\.(t|j)s$/,
              include: [new RegExp(basePath), libraryInclude],
              use: [
                {
                  loader: require.resolve('worker-loader'),
                  options: {
                    inline: 'fallback',
                    filename:
                      nohash ? '[name].js'
                      : mode === 'production' ? '[name]-[contenthash].js'
                      : '[name].js',
                  },
                },
                generateBabelLoader({
                  rootPath,
                  babelRoot,
                  target: argv?.target,
                  mode,
                  babelLoaderOptions,
                  noHotReload: true,
                }),
              ],
            },
            {
              test: /\.(t|j)sx?$/,
              use: [mainBabelLoader, ...extraJsLoaders].filter(l => l),
            },
          ],
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
          oneOf: [
            {
              issuer: /\.(j|t)sx?$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    svgoConfig: svgoOptions,
                    ...svgrOptions,
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                  options: {
                    name:
                      nohash || mode !== 'production' ?
                        '[name].[ext][query]'
                      : '[md5:contenthash:base64:8].[ext][query]',
                  },
                },
              ],
              type: 'javascript/auto',
            },
            // for non-js files always use file-loader
            {
              type: 'asset',
              generator: {
                emit: !argv?.target?.includes?.('node'),
              },
            },
          ],
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
    resolve,
    devtool: 'source-map',
    stats: {
      children: false,
      chunks: false,
      excludeAssets: [/\.map/],
    },
  };
  if (env?.name) config.name = env.name;

  if (
    process.env.WEBPACK_NO_CACHE === true ||
    process.env.WEBPACK_NO_CACHE === 'true' ||
    process.env.WEBPACK_CACHE === 'none'
  ) {
    delete config.cache;
  } else if (process.env.WEBPACK_CACHE === 'memory') {
    config.cache = true;
  } else if (process.env.WEBPACK_CACHE === 'filesystem') {
    config.cache.type = 'filesystem';
  }
  return config;
}
