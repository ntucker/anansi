import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import WebpackStrip from 'webpack-strip'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries'

import { getStyleRules, ROOT_PATH } from './base'


export default function makeProdConfig(
  baseConfig,
  { basePath = 'src', libraryExclude, buildDir = 'generated_assets/' },
) {
  const config = { ...baseConfig }

  config.mode = 'production'
  config.output.pathinfo = false
  config.plugins.push(
    new DuplicatePackageCheckerPlugin(),
    new webpack.IgnorePlugin(/DevTools/),
    new CleanWebpackPlugin([buildDir], {
      root: ROOT_PATH,
    }),
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
  )
  config.optimization.minimizer = [
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
        },
        ie8: false,
      },
      sourceMap: true,
      extractComments: true,
      parallel: true,
    }),
    new OptimizeCSSAssetsPlugin({}),
  ]
  if (process.env.WEBPACK_ANALYZE === 'true') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        generateStatsFile: false,
      }),
    )
  }
  config.module.rules.push({
    test: /\.jsx?$/,
    use: WebpackStrip.loader('debug', 'logger', 'console.log', 'console.warn', 'console.error'),
    exclude: libraryExclude,
  })

  const styleRules = getStyleRules({
    basePath,
  }).map(rule => ({
    ...rule,
    use: [MiniCssExtractPlugin.loader, ...rule.use.slice(1)],
  }))
  config.module.rules = [...config.module.rules, ...styleRules]

  return config
}
