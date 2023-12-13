export default function makeStorybookConfigGenerator(baseConfig) {
  return ({ config: storybookConfig, mode }) => {
    const env = mode.toLowerCase();
    const argv = { mode: env };
    const envConfig =
      typeof baseConfig === 'function' ? baseConfig(env, argv) : baseConfig;

    // we need some of their plugins (https://github.com/storybooks/storybook/pull/1775/files)
    const storybookPlugins = storybookConfig.plugins.filter(
      plugin =>
        // exclude ones we configure
        ![
          'DefinePlugin',
          'EnvironmentPlugin',
          'ReactRefreshPlugin',
          //'HotModuleReplacementPlugin', since storybook 6.4 we need this again
          'CaseSensitivePathsPlugin',
          // this makes process redundant
          'ProvidePlugin',
        ].includes(plugin.constructor.name),
    );
    const basePlugins = envConfig.plugins.filter(
      plugin =>
        // defer to storybook's version in this case
        // TODO: try to simply copy configuration and reuse our HtmlWebpackPlugin
        ![
          // storybook runs this build after building the storybook chrome ui, so we don't want to clear that out
          // they also clean the directory in that stage anyway
          'CleanWebpackPlugin',
          'HtmlWebpackPlugin',
          'ErrorOverlayPlugin',
          'StatsPlugin',
          // storybook puts .cache in node_modules so this prevents infinite loop
          'WatchMissingNodeModulesPlugin',
        ].includes(plugin.constructor.name),
    );

    // included rules:
    // - .mdx
    // - acorn-jsx node_modules rule
    // - any storybook specific loaders
    const isStorybookSpecific = loader =>
      /@storybook\/[^/-]+-loader\//.test(loader);
    const storybookRules = storybookConfig.module.rules.filter(rule => {
      if (rule.test?.test?.('test.mdx') || rule.test?.test?.('test.story.mdx'))
        return true;
      if (
        rule.include instanceof RegExp &&
        rule.include.test('node_modules/acorn-jsx/')
      )
        return true;
      if (rule.loader) {
        return isStorybookSpecific(rule.loader);
      } else if (rule.use) {
        return rule.use.find(loadConfig => {
          const loader =
            typeof loadConfig === 'string' ? loadConfig : loadConfig.loader;
          return isStorybookSpecific(loader);
        });
      } else {
        return false;
      }
    });

    // this transforms storybook node_modules files...not sure why this isn't done at publish time
    const libraryRule = storybookConfig.module.rules[1];
    // don't run this on our project source
    libraryRule.exclude = [envConfig?.resolve?.modules?.[0]];

    // storybook doesn't like us setting this very much.
    delete envConfig.devServer;

    const config = {
      watchOptions: storybookConfig.watchOptions,
      ...envConfig,
      resolveLoader: {
        ...envConfig.resolveLoader,
        plugins: [
          ...(envConfig.resolveLoader?.plugins ?? []),
          ...(storybookConfig.resolveLoader?.plugins ?? []),
        ],
      },
      resolve: {
        ...storybookConfig.resolve,
        modules: envConfig.resolve.modules,
        extensions: envConfig.resolve.extensions,
        alias: { ...envConfig.resolve.alias, ...storybookConfig.resolve.alias },
        plugins: [
          ...(envConfig.resolve?.plugins ?? []),
          ...(storybookConfig.resolve?.plugins ?? []),
        ],
      },

      entry: storybookConfig.entry,
      output: storybookConfig.output,
      plugins: [...storybookPlugins, ...basePlugins],
      module: {
        ...envConfig.module,
        rules: [
          // js rules (worker and normal)
          {
            test: envConfig.module.rules[0].test,
            exclude: /storybook-stories.js/,
            rules: [envConfig.module.rules[0]],
          },
          // storybook node_module compiles
          libraryRule,
          // the rest of our rules
          ...envConfig.module.rules.slice(1),
          // typically these are various plugins
          ...storybookRules,
        ],
      },
    };
    if (envConfig.cache) {
      if (
        typeof envConfig.cache === 'object' &&
        envConfig.cache.type === 'filesystem'
      ) {
        config.cache = {
          ...envConfig.cache,
          version: envConfig.cache.version + 'storybook',
        };
      } else {
        config.cache = envConfig.cache;
      }
    }
    return config;
  };
}
