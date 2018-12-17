import autoprefixer from 'autoprefixer'
import path from 'path'
import { always } from 'ramda'
import BundleTracker from 'webpack-bundle-tracker'


export const ROOT_PATH = path.resolve()
const LIBRARY_MODULES_PATH = path.join(
  'node_modules',
  ...path
    .join(__dirname, '../node_modules')
    .split(path.sep)
    .slice(-2),
)

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
]

export function getStyleRules({
  basePath = 'src',
  libraryInclude = always(false),
  libraryExclude = always(false),
  cssLoaderOptions = {},
}) {
  const absoluteBasePath = path.join(ROOT_PATH, basePath)
  const cssLoaders = getCSSLoaders({ basePath })
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
              modules: true,
              camelCase: true,
              ...cssLoaderOptions,
            },
          }
        }
        return loader
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
  ]
}

export default function makeBaseConfig({
  basePath = 'src',
  libraryInclude = always(false),
  libraryExclude,
  buildDir = 'generated_assets/',
}) {
  return {
    context: ROOT_PATH,
    entry: {
      App: [`./${basePath}/index.js`],
    },
    output: {
      path: path.join(ROOT_PATH, buildDir),
      filename: '[name]-[contenthash].js',
      chunkFilename: '[name]-[contenthash].chunk.js',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    target: 'web',
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|schedule|object-assign|loose-envify)[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
          styles: {
            test: /style\/.*\.scss$/,
            name: 'style',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    plugins: [new BundleTracker({ filename: 'webpack-stats.json' })],
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: ['babel-loader', 'worker-loader'],
        },
        {
          test: /\.jsx?$/,
          use: 'babel-loader',
          include: [new RegExp(basePath), /.storybook/, libraryInclude],
          exclude: libraryExclude,
        },
        {
          test: /\.(png|jpg|gif|ico)$/,
          use: [{ loader: 'url-loader', options: { limit: 1000 } }],
        },
        {
          test: /\.(md|txt)$/,
          use: 'raw-loader',
        },
        {
          test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            { loader: 'url-loader', options: { limit: 1000, mimetype: 'application/font-woff' } },
          ],
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: { limit: 1000, mimetype: 'application/octet-stream' },
            },
          ],
        },
        {
          test: /\.(otf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: 'file-loader',
        },
        {
          test: /\.(pdf|webm|mp4)$/,
          use: 'file-loader',
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [{ loader: 'url-loader', options: { limit: 1000, mimetype: 'image/svg+xml' } }],
        },
        {
          test: /\.isvg(\?v=\d+\.\d+\.\d+)?$/,
          use: 'svg-react-loader',
        },
      ],
    },
    resolve: {
      modules: [
        path.join(ROOT_PATH, basePath),
        path.join(ROOT_PATH, basePath, 'style'),
        'node_modules',
      ],
      extensions: ['.js', '.scss'],
      symlinks: false,
    },
    // include the loaders installed by this library
    resolveLoader: {
      modules: ['node_modules', LIBRARY_MODULES_PATH],
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main'],
    },
    devtool: '#source-map',
    stats: {
      children: false,
      chunks: false,
    },
  }
}
