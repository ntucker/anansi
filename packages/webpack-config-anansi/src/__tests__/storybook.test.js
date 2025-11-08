import { makeConfig } from '../index.js';
import makeStorybookConfigGenerator, {
  isStorybookSpecific,
  findLoadersInRule,
  findLibraryRule,
} from '../storybook.js';

class StorybookHtmlPlugin {}
class ProvidePlugin {}
class StorybookRetainedPlugin {}

const createEnvConfig = (mode = 'development') => {
  const factory = makeConfig({
    rootPath: process.cwd(),
    basePath: 'packages/webpack-config-anansi/src/__tests__/fixtures',
    globalStyleDir: 'style',
    babelRoot: '',
    tsconfigPathsOptions: false,
  });
  return factory({}, { mode });
};

const createStorybookConfigSB8 = () => ({
  watchOptions: { ignored: /storybook/ },
  entry: ['sb8-entry'],
  output: { path: '/sb8/cache', filename: 'iframe.js' },
  plugins: [
    new StorybookHtmlPlugin(),
    new ProvidePlugin(),
    new StorybookRetainedPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.stories\.[tj]sx?$/,
        use: [
          {
            loader:
              '@storybook/builder-webpack5/dist/loaders/export-order-loader.js',
          },
        ],
      },
      {
        include: 'node_modules/@storybook',
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.mdx$/,
        use: [{ loader: '@storybook/addon-docs/dist/mdx-loader.js' }],
      },
    ],
  },
  resolve: {
    modules: ['sb8-modules'],
    extensions: ['.mjs', '.js'],
    alias: { '@storybook/react': '/sb8/react' },
    fallback: { assert: false },
    plugins: ['sb8-resolve-plugin'],
  },
  resolveLoader: { plugins: ['sb8-loader-plugin'] },
});

const createStorybookConfigSB9 = () => ({
  watchOptions: { ignored: /storybook/ },
  entry: ['sb9-entry'],
  output: { path: '/sb9/cache', filename: 'iframe.js' },
  plugins: [
    new StorybookHtmlPlugin(),
    new ProvidePlugin(),
    new StorybookRetainedPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /storybook-stories\.js/,
        rules: [
          {
            test: /\.(t|j)sx?$/,
            use: ['babel-loader'],
          },
        ],
      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader' }],
      },
      {
        include: /node_modules\/@storybook\//,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.mdx$/,
        use: [{ loader: '@storybook/addon-docs/dist/mdx-loader.js' }],
      },
    ],
  },
  resolve: {
    modules: ['sb9-modules'],
    extensions: ['.mjs', '.js'],
    alias: { '@storybook/react': '/sb9/react' },
    fallback: { assert: false },
    plugins: ['sb9-resolve-plugin'],
  },
  resolveLoader: { plugins: ['sb9-loader-plugin'] },
});

const pluginNames = plugins => plugins.map(plugin => plugin.constructor.name);

describe('helper functions', () => {
  describe('isStorybookSpecific', () => {
    it('detects Storybook loader paths', () => {
      expect(
        isStorybookSpecific('@storybook/addon-docs/dist/mdx-loader.js'),
      ).toBe(true);
      expect(
        isStorybookSpecific(
          '@storybook/builder-webpack5/dist/loaders/export-order-loader.js',
        ),
      ).toBe(true);
    });

    it('returns false for non-Storybook loaders', () => {
      expect(isStorybookSpecific('babel-loader')).toBe(false);
      expect(isStorybookSpecific(undefined)).toBe(false);
    });
  });

  describe('findLoadersInRule', () => {
    it('collects loaders from nested rule structures', () => {
      const rule = {
        loader: 'babel-loader',
        use: [
          'style-loader',
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
        rules: [
          {
            use: [{ loader: 'nested-loader' }],
          },
        ],
      };

      expect(findLoadersInRule(rule)).toEqual([
        'babel-loader',
        'style-loader',
        'css-loader',
        'sass-loader',
        'nested-loader',
      ]);
    });
  });

  describe('findLibraryRule', () => {
    it('prefers the rule at index 1 when it targets Storybook modules', () => {
      const storybookConfig = createStorybookConfigSB8();
      expect(findLibraryRule(storybookConfig)).toBe(
        storybookConfig.module.rules[1],
      );
    });

    it('falls back to scanning for a rule that includes Storybook modules', () => {
      const storybookConfig = createStorybookConfigSB9();
      expect(findLibraryRule(storybookConfig)).toBe(
        storybookConfig.module.rules[2],
      );
    });

    it('returns the second rule when no better match is found', () => {
      const storybookConfig = { module: { rules: [{}, {}] } };
      expect(findLibraryRule(storybookConfig)).toBe(
        storybookConfig.module.rules[1],
      );
    });

    it('returns undefined when Storybook config has no rules', () => {
      expect(findLibraryRule({ module: { rules: [] } })).toBeUndefined();
      expect(findLibraryRule({})).toBeUndefined();
    });
  });
});

describe('makeStorybookConfigGenerator integration', () => {
  const createGenerator = mode => {
    const envConfig = createEnvConfig(mode);
    return {
      envConfig,
      generator: makeStorybookConfigGenerator(envConfig),
    };
  };

  it('merges configuration for Storybook 8 style outputs', () => {
    const { envConfig, generator } = createGenerator('development');
    const storybookConfig = createStorybookConfigSB8();

    const result = generator({ config: storybookConfig, mode: 'DEVELOPMENT' });

    const expectedWatchOptions =
      envConfig.watchOptions ?? storybookConfig.watchOptions;
    expect(result.watchOptions).toBe(expectedWatchOptions);
    expect(result.entry).toBe(storybookConfig.entry);
    expect(result.output).toBe(storybookConfig.output);

    expect(result.module.rules[0].rules[0]).toBe(envConfig.module.rules[0]);
    expect(result.module.rules[1]).toBe(storybookConfig.module.rules[1]);

    envConfig.module.rules.slice(1).forEach(rule => {
      expect(result.module.rules).toContain(rule);
    });

    const expectedStorybookRules = [
      storybookConfig.module.rules[0],
      storybookConfig.module.rules[2],
    ];
    expectedStorybookRules.forEach(rule => {
      expect(result.module.rules).toContain(rule);
    });

    expect(storybookConfig.module.rules[1].exclude).toContain(
      envConfig.resolve.modules[0],
    );

    const pluginSet = pluginNames(result.plugins);
    expect(pluginSet).toContain('StorybookHtmlPlugin');
    expect(pluginSet).toContain('StorybookRetainedPlugin');
    expect(pluginSet.filter(name => name === 'ProvidePlugin')).toHaveLength(1);

    expect(result.resolve.alias).toEqual(
      expect.objectContaining(storybookConfig.resolve.alias),
    );
    expect(result.resolve.alias).toEqual(
      expect.objectContaining(envConfig.resolve.alias ?? {}),
    );
    const expectedFallback = {
      ...(envConfig.resolve.fallback ?? {}),
      ...(storybookConfig.resolve.fallback ?? {}),
    };
    expect(result.resolve.fallback).toEqual(expectedFallback);
    expect(result.resolve.fallback.assert).toBe(false);
    if (storybookConfig.resolve.plugins) {
      expect(result.resolve.plugins).toEqual(
        expect.arrayContaining(storybookConfig.resolve.plugins),
      );
    }
    expect(result.resolve.plugins).toEqual(
      expect.arrayContaining(envConfig.resolve.plugins ?? []),
    );
    if (storybookConfig.resolveLoader.plugins) {
      expect(result.resolveLoader.plugins).toEqual(
        expect.arrayContaining(storybookConfig.resolveLoader.plugins),
      );
    }
    if (envConfig.resolveLoader?.plugins) {
      expect(result.resolveLoader.plugins).toEqual(
        expect.arrayContaining(envConfig.resolveLoader.plugins),
      );
    }

    if (envConfig.cache && typeof envConfig.cache === 'object') {
      expect(result.cache.version).toBe(`${envConfig.cache.version}storybook`);
    }
  });

  it('merges configuration for Storybook 9 style outputs', () => {
    const { envConfig, generator } = createGenerator('production');
    const storybookConfig = createStorybookConfigSB9();

    const result = generator({ config: storybookConfig, mode: 'PRODUCTION' });

    const expectedWatchOptions =
      envConfig.watchOptions ?? storybookConfig.watchOptions;
    expect(result.watchOptions).toBe(expectedWatchOptions);
    expect(result.entry).toBe(storybookConfig.entry);
    expect(result.output).toBe(storybookConfig.output);
    expect(result.module.rules[0].rules[0]).toBe(envConfig.module.rules[0]);
    expect(result.module.rules[1]).toBe(storybookConfig.module.rules[2]);

    envConfig.module.rules.slice(1).forEach(rule => {
      expect(result.module.rules).toContain(rule);
    });

    const expectedStorybookRules = [storybookConfig.module.rules[3]];
    expectedStorybookRules.forEach(rule => {
      expect(result.module.rules).toContain(rule);
    });

    expect(storybookConfig.module.rules[2].exclude).toContain(
      envConfig.resolve.modules[0],
    );

    const pluginSet = pluginNames(result.plugins);
    expect(pluginSet).toContain('StorybookHtmlPlugin');
    expect(pluginSet).toContain('StorybookRetainedPlugin');
    expect(pluginSet.filter(name => name === 'ProvidePlugin')).toHaveLength(1);

    expect(result.resolve.alias).toEqual(
      expect.objectContaining(storybookConfig.resolve.alias),
    );
    expect(result.resolve.alias).toEqual(
      expect.objectContaining(envConfig.resolve.alias ?? {}),
    );
    const expectedFallback = {
      ...(envConfig.resolve.fallback ?? {}),
      ...(storybookConfig.resolve.fallback ?? {}),
    };
    expect(result.resolve.fallback).toEqual(expectedFallback);
    expect(result.resolve.fallback.assert).toBe(false);
    if (storybookConfig.resolve.plugins) {
      expect(result.resolve.plugins).toEqual(
        expect.arrayContaining(storybookConfig.resolve.plugins),
      );
    }
    expect(result.resolve.plugins).toEqual(
      expect.arrayContaining(envConfig.resolve.plugins ?? []),
    );
    if (storybookConfig.resolveLoader.plugins) {
      expect(result.resolveLoader.plugins).toEqual(
        expect.arrayContaining(storybookConfig.resolveLoader.plugins),
      );
    }
    if (envConfig.resolveLoader?.plugins) {
      expect(result.resolveLoader.plugins).toEqual(
        expect.arrayContaining(envConfig.resolveLoader.plugins),
      );
    }

    if (envConfig.cache && typeof envConfig.cache === 'object') {
      expect(result.cache.version).toBe(`${envConfig.cache.version}storybook`);
    }
  });
});
