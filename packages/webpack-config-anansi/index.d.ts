import type { TransformOptions } from '@babel/core';
import type { LoaderOptions as WYWOptions } from '@wyw-in-js/webpack-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { PluginOptions as MiniCssExtractPluginOptions } from 'mini-css-extract-plugin';
import type { Options as SassOptions } from 'sass-loader';
import type { Config as OptimizeOptions } from 'svgo';
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
  /** Use to compile for libraries rather than web applications */
  library?: Configuration['output']['library'] | boolean;
  /** Pass package.json object for automatic configuration based on package settings */
  pkg?: {
    main?: string;
    type?: string;
    publishConfig?: { main?: string };
    [key: string]: unknown;
  };
  htmlOptions?: HtmlWebpackPlugin.Options | false;
  svgoOptions?: OptimizeOptions | false;
  svgrOptions?:
    | { svgoConfig?: OptimizeOptions; [key: string]: unknown }
    | false;
  inJSOptions?: WYWOptions | false;
  cssExtractOptions?: MiniCssExtractPluginOptions | false;
  tsconfigPathsOptions?: TsconfigPathsOptions | false;
  globalStyleDir?: string | false;
  sassOptions?: SassOptions | false;
  sassResources?: string[];
  cssModulesOptions?: any;
  fontPreload?: 'preload' | 'prefetch';
  bundleAnalyzerOptions?: BundleAnalyzerPlugin.Options;
  /** Customize terser options for production builds */
  terserOptions?: any;
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
