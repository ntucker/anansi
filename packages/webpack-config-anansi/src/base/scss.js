import autoprefixer from 'autoprefixer';
import cssPresetEnv from 'postcss-preset-env';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { always } from 'ramda';

const getCSSLoaders = ({ mode }) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: true,
        hmr: mode !== 'production',
      },
    },
    {
      loader: 'css-loader',
      options: {},
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [autoprefixer(), cssPresetEnv()],
      },
    },
  ];
  return loaders;
};

const getSASSLoaders = ({ sassResources }) => {
  const loaders = [
    {
      loader: 'sass-loader',
      options: { sassOptions: { outputStyle: 'expanded' } },
    },
  ];
  if (sassResources) {
    loaders.push({
      loader: 'sass-resources-loader',
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
  mode,
}) {
  const absoluteBasePath = path.join(rootPath, basePath);
  const cssLoaders = getCSSLoaders({ mode });
  const cssModuleLoaders = cssLoaders.map(loader => {
    if (loader.loader === 'css-loader') {
      return {
        ...loader,
        options: {
          ...loader.options,
          modules: {
            mode: 'local',
            exportLocalsConvention: 'camelCase',
            ...cssModulesOptions,
          },
        },
      };
    }
    return loader;
  });
  const sassLoaders = getSASSLoaders({ sassResources });
  return [
    // css modules (local styles)
    {
      test: /\.scss$/i,
      include: [absoluteBasePath, libraryInclude],
      exclude: [/style\//g, libraryExclude],
      use: [...cssModuleLoaders, ...sassLoaders],
    },
    // plain css as css-modules
    {
      test: /\.css$/i,
      include: [absoluteBasePath, libraryInclude],
      exclude: [/style\//g, libraryExclude],
      use: cssModuleLoaders,
    },
    // global styles
    {
      test: /\.scss$/i,
      include: [absoluteBasePath],
      exclude: /^((?!(style\/|node_modules\/)).)*$/,
      use: [...cssLoaders, ...sassLoaders],
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
        if (loader.loader === 'css-loader') {
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
    },
  ];
}
