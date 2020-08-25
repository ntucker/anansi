import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CrittersPlugin from 'critters-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin';
import cssnano from 'cssnano';
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
    htmlOptions = { title: '', scriptLoading: 'defer' },
    sassResources,
  },
) {
  const config = { ...baseConfig };

  config.mode = 'production';
  config.bail = true; // this helps automatic build tools not waste time
  if (argv.target !== 'node') {
    config.plugins.push(
      new webpack.IgnorePlugin(/DevTools/),
      new CleanWebpackPlugin(),
      new webpack.HashedModuleIdsPlugin(),
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
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      maxAsyncRequests: 50,
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
  if (!argv.readable) {
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
          keep_classnames: !!argv?.profile,
          keep_fnames: !!argv?.profile,
        },
        sourceMap: true,
        extractComments: true,
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: !isWsl,
        cache: true,
      }),
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
  }).map((rule, i) =>
    rule.enforce === 'pre' || i !== 0
      ? rule
      : {
          ...rule,
          use: rule.use.map(use =>
            // this map just adds cssnano to postcss plugins
            use.loader === 'postcss-loader'
              ? {
                  ...use,
                  options: {
                    ...use.options,
                    plugins: [...use.options.plugins, cssnano()],
                  },
                }
              : use,
          ),
        },
  );
  config.module.rules = [...config.module.rules, ...styleRules];

  if (argv?.profile) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    };
  }
  return config;
}
