import type { TransformOptions } from '@babel/core';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { PluginOptions as MiniCssExtractPluginOptions } from 'mini-css-extract-plugin';
import type { Options as SassOptions } from 'sass-loader';
import type { OptimizeOptions } from 'svgo';
import type { Options as TsconfigPathsOptions } from 'tsconfig-paths-webpack-plugin/lib/options';
import type {
  Configuration,
  RuleSetUseItem,
  RuleSetConditionAbsolute,
} from 'webpack';
import type { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export interface Options {
  rootPath?: string;
  basePath?: string;
  babelRoot?: string;
  libraryInclude?: RuleSetConditionAbsolute;
  libraryExclude?: RuleSetConditionAbsolute;
  buildDir?: string;
  serverDir?: string;
  manifestFilename?: string;
  mode?: Configuration['mode'];
  nohash?: boolean;
  argv?: any[];
  env?: any;
  htmlOptions?: HtmlWebpackPlugin.Options | false;
  svgoOptions?: OptimizeOptions | false;
  svgrOptions?:
    | { svgoConfig?: OptimizeOptions; [key: string]: unknown }
    | false;
  // TODO: get proper types https://github.com/Anber/wyw-in-js/issues/28
  inJSOptions?: any | false;
  cssExtractOptions?: MiniCssExtractPluginOptions | false;
  tsconfigPathsOptions?: TsconfigPathsOptions | false;
  globalStyleDir?: string | false;
  sassOptions?: SassOptions | false;
  sassResources?: string[];
  cssModuleOptions?: any;
  fontPreload?: 'preload' | 'prefetch';
  bundleAnalyzerOptions?: BundleAnalyzerPlugin.Options;
  babelLoader?: TransformOptions & {
    cacheDirectory?: string;
    cacheIdentifier?: any;
    cacheCompression?: boolean;
    customize?: any;
    metadataSubscribers?: any[];
  }; // babel loader options
  extraJsLoaders?: RuleSetUseItem[];
}

export function makeConfig(
  options: Options,
): (env: any, argv: any[]) => Configuration;
export function makeStorybookConfigGenerator(
  baseConfig: Configuration,
): ({ config: Configuration, mode: string }) => Configuration;
