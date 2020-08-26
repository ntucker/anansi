export default function makeStorybookConfigGenerator(baseConfig) {
  return ({ config: storybookConfig, mode }) => {
    const env = mode.toLowerCase();
    const argv = { mode: env };
    const envConfig =
      typeof baseConfig === 'function' ? baseConfig(env, argv) : baseConfig;

    // we need some of their plugins (https://github.com/storybooks/storybook/pull/1775/files)
    const storybookPlugins = storybookConfig.plugins.filter(
      plugin =>
        ![
          'DefinePlugin',
          'HotModuleReplacementPlugin',
          'CaseSensitivePathsPlugin',
        ].includes(plugin.constructor.name),
    );
    const basePlugins = envConfig.plugins.filter(
      plugin =>
        ![
          'HtmlWebpackPlugin',
          'ReactRefreshPlugin',
          'ErrorOverlayPlugin',
        ].includes(plugin.constructor.name),
    );
    if (env === 'dev') {
      try {
        require('@hot-loader/react-dom');
        envConfig.resolve.alias['react-dom'] = '@hot-loader/react-dom';
        envConfig.devServer.hotOnly = false;
      } catch (e) {}
    }

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
        modules: envConfig.modules,
        extensions: envConfig.extensions,
        alias: { ...envConfig.alias, ...storybookConfig.alias },
      },
      entry: storybookConfig.entry,
      output: storybookConfig.output,
      plugins: [...storybookPlugins, ...basePlugins],
      module: {
        ...envConfig.module,
        rules: [
          envConfig.module.rules[0],
          {
            // don't use thread-loader
            ...envConfig.module.rules[1],
            use: envConfig.module.rules[1].use.filter(
              l => l !== 'thread-loader',
            ),
          },
          ...storybookConfig.module.rules.slice(2, 7),
          ...envConfig.module.rules.slice(2),
        ],
      },
    };
  };
}
