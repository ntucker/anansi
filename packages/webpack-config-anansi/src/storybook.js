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
          'ReactRefreshPlugin',
          'HotModuleReplacementPlugin',
          'CaseSensitivePathsPlugin',
        ].includes(plugin.constructor.name),
    );
    const basePlugins = envConfig.plugins.filter(
      plugin =>
        // defer to storybook's version in this case
        !['HtmlWebpackPlugin', 'ErrorOverlayPlugin', 'StatsPlugin'].includes(
          plugin.constructor.name,
        ),
    );

    // ignore all their 'react' rules, as we already provide react handling
    // other addons might add rules, so be sure to include those here
    const storybookRules = storybookConfig.module.rules.filter(rule => {
      if (rule.loader) {
        return !rule.loader.includes('@storybook/react');
      }
      if (rule.use) {
        return !rule.use.find(loadConfig => {
          const loader =
            typeof loadConfig === 'string' ? loadConfig : loadConfig.loader;
          return loader.includes('@storybook/react');
        });
      }
    });

    // this transforms storybook node_modules files...not sure why this isn't done at publish time
    const libraryRule = storybookConfig.module.rules[1];
    // don't run this on our project source
    libraryRule.exclude = [envConfig?.resolve?.modules?.[0]];

    // storybook doesn't like us setting this very much.
    delete envConfig.devServer;

    return {
      ...envConfig,
      resolveLoader: {
        ...envConfig.resolveLoader,
        plugins: [
          ...(envConfig.resolveLoader.plugins || []),
          ...storybookConfig.resolveLoader.plugins,
        ],
      },
      resolve: {
        ...storybookConfig.resolve,
        modules: envConfig.resolve.modules,
        extensions: envConfig.resolve.extensions,
        alias: { ...envConfig.resolve.alias, ...storybookConfig.resolve.alias },
      },
      entry: storybookConfig.entry,
      output: storybookConfig.output,
      plugins: [...storybookPlugins, ...basePlugins],
      module: {
        ...envConfig.module,
        rules: [
          //web workers
          envConfig.module.rules[0],
          //normal js/ts
          {
            // don't use thread-loader
            ...envConfig.module.rules[1],
            use: envConfig.module.rules[1].use.filter(
              l => !/($|\/)thread-loader/g.test(l),
            ),
          },
          // storybook node_module compiles
          libraryRule,
          // the rest of our rules
          ...envConfig.module.rules.slice(2),
          // typically these are various plugins
          ...storybookRules,
        ],
      },
    };
  };
}
