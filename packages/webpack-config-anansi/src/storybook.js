const isStorybookSpecific = loader => {
  if (!loader || typeof loader !== 'string') return false;
  if (!loader.includes('@storybook')) return false;
  return loader.includes('loader');
};

const findLoadersInRule = rule => {
  if (!rule) return [];

  const loaders = [];
  if (rule.loader) {
    loaders.push(rule.loader);
  }
  if (rule.use) {
    const useArray = Array.isArray(rule.use) ? rule.use : [rule.use];
    useArray.forEach(loadConfig => {
      if (typeof loadConfig === 'string') {
        loaders.push(loadConfig);
      } else if (loadConfig?.loader) {
        loaders.push(loadConfig.loader);
      }
    });
  }
  if (rule.rules && Array.isArray(rule.rules)) {
    rule.rules.forEach(nestedRule => {
      loaders.push(...findLoadersInRule(nestedRule));
    });
  }
  return loaders;
};

const findLibraryRule = storybookConfig => {
  const rules = storybookConfig?.module?.rules;
  if (!Array.isArray(rules) || rules.length === 0) return undefined;

  // Storybook 8 specific case; we know the rule is at index 1
  if (rules[1] && !rules[1].test?.test?.('test.mdx')) {
    const candidate = rules[1];
    let hasNodeModulesInclude = false;
    if (candidate.include) {
      if (typeof candidate.include === 'string') {
        hasNodeModulesInclude = candidate.include.includes('node_modules');
      } else if (candidate.include instanceof RegExp) {
        hasNodeModulesInclude = candidate.include.test(
          'node_modules/@storybook',
        );
      }
    }
    const candidateLoaders = findLoadersInRule(candidate);
    const hasStorybookLoader = candidateLoaders.some(
      loader => typeof loader === 'string' && loader.includes('@storybook'),
    );
    if (hasNodeModulesInclude || hasStorybookLoader) {
      return candidate;
    }
  }

  for (const rule of rules) {
    if (!rule?.include) continue;
    let includeStr = '';
    if (typeof rule.include === 'string') {
      includeStr = rule.include;
    } else if (rule.include instanceof RegExp) {
      includeStr = rule.include.toString();
    }

    if (
      includeStr.includes('@storybook') ||
      includeStr.includes('node_modules')
    ) {
      const loaders = findLoadersInRule(rule);
      if (!loaders.some(l => /export-order-loader|mdx-loader/.test(l))) {
        return rule;
      }
    }
  }

  return rules[1];
};

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
    // - .stories files
    // - acorn-jsx node_modules rule
    // - any storybook specific loaders (export-order-loader, mdx-loader, etc.)
    const storybookRules = storybookConfig.module.rules.filter(rule => {
      // MDX files
      if (rule.test?.test?.('test.mdx') || rule.test?.test?.('test.story.mdx'))
        return true;
      // Story files
      if (
        rule.test?.test?.('test.stories.tsx') ||
        rule.test?.test?.('test.stories.jsx')
      )
        return true;
      // acorn-jsx node_modules rule
      if (
        rule.include instanceof RegExp &&
        rule.include.test('node_modules/acorn-jsx/')
      )
        return true;
      // Check for storybook-specific loaders
      const loaders = findLoadersInRule(rule);
      if (loaders.some(isStorybookSpecific)) {
        return true;
      }
      // Check for export-order-loader or mdx-loader (SB9 specific)
      if (
        loaders.some(
          l =>
            l &&
            (l.includes('export-order-loader') ||
              l.includes('mdx-loader') ||
              l.includes('@storybook/builder-webpack5')),
        )
      ) {
        return true;
      }
      return false;
    });

    // Find the library rule that compiles storybook's own node_modules
    const libraryRule = findLibraryRule(storybookConfig);
    // Don't run this on our project source
    if (libraryRule && envConfig?.resolve?.modules?.[0]) {
      // Ensure exclude is an array
      if (!libraryRule.exclude) {
        libraryRule.exclude = [];
      } else if (!Array.isArray(libraryRule.exclude)) {
        libraryRule.exclude = [libraryRule.exclude];
      }
      // Add our source directory to exclude
      const sourcePath = envConfig.resolve.modules[0];
      if (!libraryRule.exclude.includes(sourcePath)) {
        libraryRule.exclude.push(sourcePath);
      }
    }

    // storybook doesn't like us setting this very much.
    delete envConfig.devServer;

    const otherEnvRules = envConfig.module.rules.slice(1);

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
        fallback: {
          ...envConfig.resolve.fallback,
          ...(storybookConfig.resolve?.fallback ?? {}),
        },
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
          // storybook node_module compiles (only if found)
          ...(libraryRule ? [libraryRule] : []),
          // the rest of our rules
          ...otherEnvRules,
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

export { isStorybookSpecific, findLoadersInRule, findLibraryRule };
