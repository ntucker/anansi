import { makeStorybookConfigGenerator } from '@anansi/webpack-config';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  PresetProperty,
  PresetPropertyFn,
  Options,
} from 'storybook/internal/types';

import type { FrameworkOptions, StorybookConfig } from './types.js';

type WebpackFinalResult = Awaited<
  ReturnType<NonNullable<StorybookConfig['webpackFinal']>>
>;

const require = createRequire(import.meta.url);

const resolvePackageDir = (input: string) =>
  dirname(fileURLToPath(import.meta.resolve(`${input}/package.json`)));

const resolveModuleEntry = (input: string) =>
  fileURLToPath(import.meta.resolve(input));

export const addons: PresetProperty<'addons', StorybookConfig> = [];

const defaultFrameworkOptions: FrameworkOptions = {
  legacyRootApi: false,
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
      name: resolvePackageDir('@anansi/storybook') as '@anansi/storybook',
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

export const core: PresetPropertyFn<'core', StorybookConfig> = async (
  config,
  options,
) => {
  const framework =
    await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: '@storybook/builder-webpack5',
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: '@storybook/react',
  };
};

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (
  entry = [],
) => [...entry, require.resolve('./preview.js')];

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
    '@storybook/react': resolveModuleEntry('@storybook/react'),
  };

  const projectConfig = require(join(options.configDir, '../webpack.config'));
  return makeStorybookConfigGenerator(projectConfig)({
    config: storybookConfig,
    mode: process.env.NODE_ENV,
  }) as WebpackFinalResult;
};
