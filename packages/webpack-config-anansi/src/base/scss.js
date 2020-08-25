import autoprefixer from 'autoprefixer';
import cssPresetEnv from 'postcss-preset-env';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { always } from 'ramda';

const getCSSLoaders = ({ sassResources, mode }) => {
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
  cssLoaderOptions = {},
  sassResources,
  mode,
}) {
  const absoluteBasePath = path.join(rootPath, basePath);
  const cssLoaders = getCSSLoaders({ sassResources, mode });
  return [
    // css modules (local styles)
    {
      test: /\.s?css$/,
      include: [absoluteBasePath, libraryInclude],
      exclude: [/style\//g, libraryExclude],
      use: cssLoaders.map(loader => {
        if (loader.loader === 'css-loader') {
          return {
            ...loader,
            options: {
              ...loader.options,
              modules: {
                mode: 'local',
                exportLocalsConvention: 'camelCase',
              },
              ...cssLoaderOptions,
            },
          };
        }
        return loader;
      }),
    },
    // global styles
    {
      test: /\.s?css$/,
      include: [absoluteBasePath],
      exclude: /^((?!(style\/|node_modules\/)).)*$/,
      use: cssLoaders,
    },
    // css-in-js like linaria
    {
      test: /\.css$/,
      include: [rootPath],
      exclude: [/node_modules/],
      use: cssLoaders.slice(0, -1),
    },
    // package css
    {
      test: /\.css$/,
      include: [/node_modules/],
      use: cssLoaders.slice(0, -2).map(loader => {
        if (loader.loader === 'css-loader') {
          return {
            ...loader,
            options: {
              ...loader.options,
              modules: {
                mode: 'local',
                exportLocalsConvention: 'camelCase',
              },
              ...cssLoaderOptions,
            },
          };
        }
        return loader;
      }),
    },
  ];
}
