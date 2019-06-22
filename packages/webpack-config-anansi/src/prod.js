import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';
import cssnano from 'cssnano';
import isWsl from 'is-wsl';

import { getStyleRules } from './base';

export default function makeProdConfig(
  baseConfig,
  { basePath, libraryInclude, libraryExclude, buildDir },
) {
  const config = { ...baseConfig };

  config.mode = 'production';
  config.bail = true; // this helps automatic build tools not waste time
  config.plugins.push(
    new webpack.IgnorePlugin(/DevTools/),
    new CleanWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
  );
  config.module.rules.push({
    test: /\.svg$/,
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
  config.optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        parse: {
          ecma: 8,
        },
        compress: {
          ecma: 5,
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
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
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
  config.performance = {
    maxEntrypointSize: 300000,
    assetFilter(assetFilename) {
      return !/\.(map|LICENSE)$/.test(assetFilename);
    },
  };

  const styleRules = getStyleRules({
    basePath,
    libraryInclude,
    libraryExclude,
  }).map(rule =>
    rule.enforce === 'pre'
      ? rule
      : {
          ...rule,
          use: [
            MiniCssExtractPlugin.loader,
            ...rule.use.slice(1).map(use =>
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
          ],
        },
  );
  config.module.rules = [...config.module.rules, ...styleRules];

  return config;
}
