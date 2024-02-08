/* eslint-disable @typescript-eslint/no-var-requires */
import { makeStorybookConfigGenerator } from '@anansi/webpack-config';
import type { PresetProperty, Options } from '@storybook/types';
import { dirname, join } from 'path';

import type { FrameworkOptions, StorybookConfig } from './types.js';

const wrapForPnP = (input: string) =>
  dirname(require.resolve(join(input, 'package.json')));

export const addons: PresetProperty<'addons', StorybookConfig> = [];

const defaultFrameworkOptions: FrameworkOptions = {
  legacyRootApi: false,
  fastRefresh: true,
  strictMode: true,
};

export const frameworkOptions = async (
  _: never,
  options: Options,
): Promise<StorybookConfig['framework']> => {
  const config =
    await options.presets.apply<StorybookConfig['framework']>('framework');

  if (typeof config === 'string') {
    return {
      name: config as any,
      options: defaultFrameworkOptions,
    };
  }
  if (typeof config === 'undefined') {
    return {
      name: wrapForPnP('@anansi/storybook') as '@anansi/storybook',
      options: defaultFrameworkOptions,
    };
  }

  return {
    name: config.name,
    options: {
      ...defaultFrameworkOptions,
      ...config.options,
    },
  };
};

export const core: PresetProperty<'core', StorybookConfig> = async (
  config,
  options,
) => {
  const framework =
    await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: wrapForPnP(
        '@storybook/builder-webpack5',
      ) as '@storybook/builder-webpack5',
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: wrapForPnP('@storybook/react'),
  };
};

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (
  entry = [],
) => [...entry, require.resolve('./preview')];

/*export const babel: StorybookConfig['babel'] = (config, options) => ({
  presets: [['@anansi/babel-preset', { loose: true }]],
});*/

export const webpackFinal: StorybookConfig['webpackFinal'] = async (
  storybookConfig,
  options,
) => {
  storybookConfig.resolve = storybookConfig.resolve || {};

  storybookConfig.resolve.alias = {
    ...storybookConfig.resolve?.alias,
    '@storybook/react': wrapForPnP('@storybook/react'),
  };

  const projectConfig = require(join(options.configDir, '../webpack.config'));
  return makeStorybookConfigGenerator(projectConfig)({
    config: storybookConfig,
    mode: process.env.NODE_ENV,
  });
};
