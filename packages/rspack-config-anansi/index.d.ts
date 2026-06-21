import type { TransformOptions } from '@babel/core';
import type { RsbuildConfig, RsbuildPlugin } from '@rsbuild/core';
import type { LoaderOptions as WYWOptions } from '@wyw-in-js/webpack-loader';
import type { Options as SassOptions } from 'sass-loader';
import type { Config as OptimizeOptions } from 'svgo';

export interface Options {
  /** Project root path. Defaults to process.cwd() */
  rootPath?: string;
  /** Source path relative to rootPath. Default 'src' */
  basePath?: string;
  /** Babel root mode override; passed through to babel-loader options */
  babelRoot?: string;
  /** Files matched will be compiled with our JS pipeline as if first-party */
  libraryInclude?: any;
  /** Files matched will be excluded from our JS pipeline */
  libraryExclude?: any;
  /** Output dir relative to rootPath. Default 'generated_assets/' */
  buildDir?: string;
  /** Output dir for target=node. Default 'server_assets/' */
  serverDir?: string;
  /** Manifest filename. Default 'manifest.json' */
  manifestFilename?: string;
  /** Disable hashing in output filenames */
  nohash?: boolean;
  /** Use to compile for libraries rather than web applications */
  library?: { type?: string } | boolean;
  /** Pass package.json object for automatic configuration based on package settings */
  pkg?: {
    main?: string;
    type?: string;
    publishConfig?: { main?: string };
    [key: string]: unknown;
  };
  /** Output target. Default 'web'. Use 'node' for SSR/server builds */
  target?: 'web' | 'node' | 'web-worker';
  /** Pass false to disable HTML output. Otherwise merged into html-rspack-plugin options. */
  htmlOptions?: Record<string, any> | false;
  /** SVGO options. Pass false to disable */
  svgoOptions?: OptimizeOptions | false;
  /** SVGR options. Pass false to disable */
  svgrOptions?:
    | { svgoConfig?: OptimizeOptions; [key: string]: unknown }
    | false;
  /** wyw-in-js (Linaria) loader options. Pass false to disable */
  inJSOptions?: WYWOptions | false;
  /** Pass false to disable CSS extraction (inline via style-loader) */
  cssExtractOptions?: Record<string, any> | false;
  /** tsconfig path resolution options. Pass false to disable */
  tsconfigPathsOptions?: { configFile?: string } | false;
  /** Global SCSS/CSS directory; pass false to disable */
  globalStyleDir?: string | false;
  /** sass-loader options. Pass false to disable sass entirely */
  sassOptions?: SassOptions | false;
  /** Files passed to sass-resources-loader to inject into every sass file */
  sassResources?: string[];
  /** Overrides for css-loader's modules option */
  cssModulesOptions?: Record<string, any>;
  /** When set, font assets will be preloaded/prefetched in HTML */
  fontPreload?: 'preload' | 'prefetch';
  /** Babel loader options merged into the generated config */
  babelLoader?: TransformOptions & {
    cacheDirectory?: string | boolean;
    cacheIdentifier?: any;
    cacheCompression?: boolean;
    [key: string]: any;
  };
  /** Extra rsbuild plugins to register */
  extraPlugins?: RsbuildPlugin[];
  /** When true, enables analyzer (Rsdoctor if installed) */
  analyze?: boolean;
  /** Enable runtime checks (circular dependency, duplicate package). Use 'nobuild' to fail-fast without producing output */
  check?: boolean | 'nobuild';
  /** Enable React profiler in production builds */
  profile?: boolean;
}

export function makeConfig(options?: Options): RsbuildConfig;

export function makeStorybookRsbuildConfig(
  options?: Options,
): (config: RsbuildConfig) => RsbuildConfig;
