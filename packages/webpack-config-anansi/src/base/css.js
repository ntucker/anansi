import autoprefixer from 'autoprefixer';
import cssPresetEnv from 'postcss-preset-env';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { always } from 'ramda';

const getCSSLoaders = ({ mode, target }) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { emit: !target?.includes?.('node') },
    },
    {
      loader: require.resolve('css-loader'),
      options:
        mode === 'development'
          ? { sourceMap: true, importLoaders: 1 }
          : { importLoaders: 1 },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [autoprefixer(), cssPresetEnv()],
        },
      },
    },
  ];
  return loaders;
};

const getSASSLoaders = ({ sassResources }) => {
  const loaders = [
    {
      loader: require.resolve('sass-loader'),
      options: { sassOptions: { outputStyle: 'expanded' } },
    },
  ];
  if (sassResources) {
    loaders.push({
      loader: require.resolve('sass-resources-loader'),
      options: {
        resources: sassResources,
      },
    });
  }
  return loaders;
};

export default function getStyleRules({
  rootPath,
  basePath = 'src',
  libraryInclude = always(false),
  libraryExclude = always(false),
  cssModulesOptions = {},
  sassResources,
  globalStyleDir,
  mode,
  target,
}) {
  const absoluteBasePath = path.join(rootPath, basePath);
  const cssLoaders = getCSSLoaders({ mode, target });
  const cssModuleLoaders = cssLoaders.map(loader => {
    if (/($|\/)css-loader/.test(loader.loader)) {
      return {
        ...loader,
        options: {
          ...loader.options,
          modules: {
            exportLocalsConvention: 'camelCase',
            ...cssModulesOptions,
          },
        },
      };
    } else if (loader.loader === MiniCssExtractPlugin.loader) {
      return {
        ...loader,
        options: {
          ...loader.options,
          modules: {
            ...Object.fromEntries(
              Object.entries(cssModulesOptions).filter(([k]) =>
                ['namedExport'].includes(k),
              ),
            ),
          },
        },
      };
    }
    return loader;
  });
  const sassLoaders = getSASSLoaders({ sassResources });
  const excludeCSSProcess = [libraryExclude];

  // global styles
  if (globalStyleDir !== false) {
    const globalStyleRegex = new RegExp(`${globalStyleDir}/`);
    excludeCSSProcess.unshift(globalStyleRegex);
  }
  return [
    // css modules (local styles)
    {
      test: /\.scss$/i,
      include: [absoluteBasePath, libraryInclude],
      exclude: excludeCSSProcess,
      use: [...cssModuleLoaders, ...sassLoaders],
    },
    // plain css as css-modules
    {
      test: /\.css$/i,
      include: [absoluteBasePath, libraryInclude],
      exclude: excludeCSSProcess,
      use: cssModuleLoaders,
    },
    // global styles
    globalStyleDir !== false && {
      test: /\.scss$/i,
      include: [absoluteBasePath],
      exclude: new RegExp(`^((?!(${globalStyleDir}/|node_modules/)).)*$`),
      use: [...cssLoaders, ...sassLoaders],
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
    // css-in-js like linaria do not use css-modules
    {
      test: /\.css$/i,
      include: [rootPath],
      exclude: [/node_modules/, absoluteBasePath, libraryInclude],
      use: cssLoaders,
    },
    // package css
    {
      test: /\.css$/i,
      include: [/node_modules/],
      use: cssModuleLoaders.slice(0, -1).map(loader => {
        if (/($|\/)css-loader/.test(loader.loader)) {
          return {
            ...loader,
            options: {
              ...loader.options,
              modules: {
                ...loader.options.modules,
                auto: true,
                ...cssModulesOptions,
              },
            },
          };
        }
        return loader;
      }),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
  ].filter(rule => rule);
}
