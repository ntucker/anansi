import autoprefixer from 'autoprefixer';
import path from 'path';
import { always } from 'ramda';

import { ROOT_PATH } from './constants';


const getCSSLoaders = ({ basePath }) => [
  { loader: 'style-loader' },
  {
    loader: 'css-loader',
    options: {},
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [autoprefixer({ browsers: ['last 2 versions'] })],
    },
  },
  { loader: 'sass-loader', options: { outputStyle: 'expanded' } },
  {
    loader: 'sass-resources-loader',
    options: {
      resources: [`${path.join(ROOT_PATH, basePath)}/style/export.scss`],
    },
  },
];

export default function getStyleRules({
  basePath = 'src',
  libraryInclude = always(false),
  libraryExclude = always(false),
  cssLoaderOptions = {},
}) {
  const absoluteBasePath = path.join(ROOT_PATH, basePath);
  const cssLoaders = getCSSLoaders({ basePath });
  return [
    // css modules (local styles)
    {
      test: /\.scss$/,
      include: [absoluteBasePath, libraryInclude],
      exclude: [/style\//g, libraryExclude],
      use: cssLoaders.map((loader) => {
        if (loader.loader === 'css-loader') {
          return {
            ...loader,
            options: {
              ...loader.options,
              modules: 'local',
              camelCase: true,
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
      use: cssLoaders.slice(0, -2),
    },
  ];
}
