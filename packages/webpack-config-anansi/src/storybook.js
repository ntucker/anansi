export default function makeStorybookConfigGenerator(baseConfig) {
  return ({ config: storybookConfig, mode }) => {
    const env = mode.toLowerCase();
    const argv = { mode: env };
    const envConfig =
      typeof baseConfig === 'function' ? baseConfig(env, argv) : baseConfig;

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
