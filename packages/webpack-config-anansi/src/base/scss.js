import autoprefixer from 'autoprefixer';
import cssPresetEnv from 'postcss-preset-env';
import path from 'path';
import { always } from 'ramda';

const getCSSLoaders = ({ absoluteBasePath }) => [
  { loader: 'style-loader' },
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
  { loader: 'sass-loader', options: { outputStyle: 'expanded' } },
  {
    loader: 'sass-resources-loader',
    options: {
      resources: [`${absoluteBasePath}/style/export.scss`],
    },
  },
];

export default function getStyleRules({
  rootPath,
  basePath = 'src',
  libraryInclude = always(false),
  libraryExclude = always(false),
  cssLoaderOptions = {},
}) {
  const absoluteBasePath = path.join(rootPath, basePath);
  const cssLoaders = getCSSLoaders({ absoluteBasePath });
  return [
    // css modules (local styles)
    {
      test: /\.scss$/,
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
              },
              localsConvention: 'camelCase',
              ...cssLoaderOptions,
            },
          };
        }
        return loader;
      }),
    },
    // global styles
    {
      test: /\.scss$/,
      include: [absoluteBasePath],
      exclude: /^((?!(style\/|node_modules\/)).)*$/,
      use: cssLoaders,
    },
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
              },
              localsConvention: 'camelCase',
              ...cssLoaderOptions,
            },
          };
        }
        return loader;
      }),
    },
  ];
}
