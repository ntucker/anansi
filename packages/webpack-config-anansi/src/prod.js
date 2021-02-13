import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CrittersPlugin from 'critters-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin';
import PreloadWebpackPlugin from '@vue/preload-webpack-plugin';
import isWsl from 'is-wsl';

import { getStyleRules } from './base';

export default function makeProdConfig(
  baseConfig,
  {
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    argv = {},
    env = {},
    htmlOptions = { title: '', scriptLoading: 'defer' },
    sassResources,
    cssModulesOptions,
    fontPreload,
  },
) {
  const config = { ...baseConfig };

  config.mode = 'production';
  config.bail = true; // this helps automatic build tools not waste time
  if (argv.target !== 'node') {
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /DevTools/ }),
      new CleanWebpackPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new FixStyleOnlyEntriesPlugin(),
    );
    if (htmlOptions) {
      config.plugins.unshift(
        new HtmlWebpackPlugin(htmlOptions),
        // TODO: doesn't work with latest htmlplugin https://github.com/GoogleChromeLabs/critters/issues/52
        //new CrittersPlugin({}),
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      );
      if (fontPreload) {
        if (!['preload', 'prefetch'].includes(fontPreload))
          throw new Error(
            `fontPreload: '${fontPreload}' is not valid.\nUse 'preload' or 'prefetch'`,
          );
        config.plugins.unshift(
          new PreloadWebpackPlugin({
            rel: fontPreload,
            include: 'allAssets',
            fileWhitelist: [/\.(otf|woff)/],
            as,
          }),
        );
      }
    }
  }
  config.module.rules.push({
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    enforce: 'pre',
    use: [
      {
        loader: 'svgo-loader',
        options: {
          plugins: [
            { removeTitle: false },
            { removeComments: true },
            { removeDesc: true },
            { removeUselessDefs: true },
            { removeDoctype: true },
            { removeMetadata: true },
            { convertColors: true },
            { removeViewBox: false },
          ],
        },
      },
    ],
  });
  config.optimization = {
    moduleIds: webpack.version.startsWith('4') ? 'hashed' : 'deterministic',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|object-assign|loose-envify)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
        polyfill: {
          test: /[\\/]node_modules[\\/](core-js|@babel\/runtime|regenerator-runtime|ric-shim|babel-runtime)[\\/].*/,
          name: 'polyfill',
          chunks: 'all',
        },
        styles: {
          test: /style\/.*\.scss$/,
          name: 'style',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
    runtimeChunk: {
      name: 'webpack-runtime',
    },
  };
  if (!env.readable) {
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 9,
          },
          compress: {
            ecma: 6,
            warnings: false,
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 6,
            comments: false,
            ascii_only: true,
          },
          keep_classnames: !!env?.profile,
          keep_fnames: !!env?.profile,
        },
        sourceMap: true,
        extractComments: true,
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: !isWsl,
        cache: true,
      }),
      // cssnano on node_modules as well as our loaders
      new OptimizeCSSAssetsPlugin({}),
    ];
  } else {
    config.optimization.minimize = false;
  }
  config.performance = {
    maxEntrypointSize: 300000,
    assetFilter(assetFilename) {
      return !/\.(map|LICENSE)$/.test(assetFilename);
    },
  };

  const styleRules = getStyleRules({
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    sassResources,
    cssModulesOptions,
  });
  config.module.rules = [...config.module.rules, ...styleRules];

  if (env?.profile) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    };
  }
  return config;
}

function as(entry) {
  if (/\.css$/.test(entry)) return 'style';
  if (/\.(otf|eot|woff2|woff|ttf)$/.test(entry)) return 'font';
  if (/\.(svg|png|jpg|gif|ico|webp|avif)$/.test(entry)) return 'image';
  return 'script';
}
