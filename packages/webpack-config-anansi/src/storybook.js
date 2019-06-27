import { always } from 'ramda';

import makeBaseConfig, { ROOT_PATH } from './base';
import makeDevConfig from './dev';
import makeProdConfig from './prod';

export default function makeStorybookConfigGenerator(options) {
  options = {
    rootPath: ROOT_PATH,
    basePath: 'src',
    libraryInclude: always(false),
    libraryExclude: /node_modules/,
    buildDir: 'generated_assets/',
    serverDir: 'server_assets/',
    hardCacheOptions: {},
    ...options,
  };
  return ({ config: storybookConfig, mode }) => {
    options.mode = mode;
    const baseConfig = makeBaseConfig(options);

    let envConfig;
    switch (mode) {
      case 'PRODUCTION':
        envConfig = makeProdConfig(baseConfig, options);
        break;
      default:
        envConfig = makeDevConfig(baseConfig, options);
    }
    // we need their HtmlWebpackPlugin only (https://github.com/storybooks/storybook/pull/1775/files)
    const storybookPlugins = storybookConfig.plugins.filter(plugin =>
      ['HtmlWebpackPlugin', 'DefinePlugin', 'ProgressPlugin'].includes(
        plugin.constructor.name,
      ),
    );
    const basePlugins = envConfig.plugins.filter(
      plugin => plugin.constructor.name !== 'HtmlWebpackPlugin',
    );
    return {
      ...envConfig,
      entry: storybookConfig.entry,
      output: storybookConfig.output,
      plugins: [...storybookPlugins, ...basePlugins],
      module: {
        ...envConfig.module,
        rules: [
          envConfig.module.rules[0],
          {
            ...envConfig.module.rules[1],
            use: [
              ...envConfig.module.rules[1].use,
              'react-docgen-typescript-loader',
            ],
          },
          ...envConfig.module.rules.slice(2),
        ],
      },
    };
  };
}
