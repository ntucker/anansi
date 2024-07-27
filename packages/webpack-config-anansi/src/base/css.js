import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import cssPresetEnv from 'postcss-preset-env';
import { always } from 'ramda';

const getCSSLoaders = ({ mode, target, cssExtractOptions }) => {
  const miniCssExtractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: { emit: !target?.includes?.('node') },
  };

  const loaders = [
    {
      loader: require.resolve('css-loader'),
      options:
        mode === 'development' ?
          {
            sourceMap: true,
            importLoaders: 1,
            modules: {
              mode: 'icss',
            },
          }
        : {
            importLoaders: 1,
            modules: {
              mode: 'icss',
            },
          },
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

  return cssExtractOptions === false ? loaders : (
      [miniCssExtractPluginLoader, ...loaders]
    );
};

const getSASSLoaders = ({ sassResources, sassOptions }) => {
  const loaders = [
    {
      loader: require.resolve('sass-loader'),
      options: { sassOptions },
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
  sassOptions = { outputStyle: 'expanded' },
  sassResources,
  globalStyleDir,
  mode,
  target,
  cssExtractOptions,
}) {
  const absoluteBasePath = path.join(rootPath, basePath);
  const cssLoaders = getCSSLoaders({ mode, target, cssExtractOptions });
  const cssModuleLoaders = cssLoaders.map(loader => {
    if (/($|\/)css-loader/.test(loader.loader)) {
      return {
        ...loader,
        options: {
          ...loader.options,
          modules: {
            exportLocalsConvention: 'camelCase',
            ...(process.env.NODE_ENV === 'testing' ?
              { localIdentName: '[name]__[local]' }
            : {}),
            ...cssModulesOptions,
          },
        },
      };
    }
    return loader;
  });
  // we don't need to find it if they specified the directory
  let foundSass = sassOptions?.implementation;
  try {
    if (!foundSass)
      foundSass =
        require.resolve('sass') ||
        require.resolve('node-sass') ||
        require.resolve('sass-embedded');
  } catch (e) {
    foundSass = sassOptions?.implementation;
    if (sassOptions !== false) {
      console.warn(
        '`sass`, `node-sass` or `sass-embedded` packages not found. SASS cannot be used.',
      );
    }
  }
  const sassLoaders =
    sassOptions === false || !foundSass ?
      []
    : getSASSLoaders({ sassResources, sassOptions });
  const excludeCSSProcess = [libraryExclude];

  // global styles
  if (globalStyleDir !== false) {
    const globalStyleRegex = new RegExp(`${globalStyleDir}/`);
    excludeCSSProcess.unshift(globalStyleRegex);
  }
  return {
    test: /\.s?css$/i,
    oneOf: [
      // css modules (local styles)
      sassOptions !== false && {
        test: /\.scss$/i,
        include: [absoluteBasePath, libraryInclude],
        exclude: excludeCSSProcess,
        use: [...cssModuleLoaders, ...sassLoaders],
      },
      // css-in-js like linaria do not use css-modules
      {
        test: /\.wyw-in-js\.css$/i,
        include: [absoluteBasePath, libraryInclude],
        exclude: excludeCSSProcess,
        use: cssLoaders,
      },
      // plain css as css-modules
      {
        test: /\.css$/i,
        include: [absoluteBasePath, /\.storybook/, libraryInclude],
        exclude: [...excludeCSSProcess, /\.wyw-in-js\.css$/i],
        use: cssModuleLoaders,
      },
      // global styles
      globalStyleDir !== false && {
        test: sassOptions === false ? /\.css$/i : /\.s?css$/i,
        include: [absoluteBasePath],
        exclude: [
          sassOptions === false ? /\.module\.css$/i : /\.module\.s?css$/i,
          new RegExp(`^((?!(${globalStyleDir}/|node_modules/)).)*$`),
        ],
        use: [...cssLoaders, ...sassLoaders],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      globalStyleDir !== false && {
        test: sassOptions === false ? /\.module\.css$/i : /\.module\.s?css$/i,
        include: [absoluteBasePath],
        exclude: [new RegExp(`^((?!(${globalStyleDir}/|node_modules/)).)*$`)],
        use: [...cssModuleLoaders, ...sassLoaders],
      },
      // css-in-js like linaria do not use css-modules - 3beta.14 and below
      {
        test: /\.css$/i,
        include: [/node_modules\/\.cache/],
        exclude: [absoluteBasePath, libraryInclude],
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
        sideEffects: !target?.includes?.('node'),
      },
    ].filter(rule => rule),
  };
}
