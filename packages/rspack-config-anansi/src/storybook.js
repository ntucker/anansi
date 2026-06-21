import { makeConfig } from './index';

// Helper for use from `.storybook/main.ts` with `storybook-react-rsbuild`:
//
//   import { makeStorybookRsbuildConfig } from '@anansi/rspack-config';
//   import { mergeRsbuildConfig } from '@rsbuild/core';
//
//   const config: StorybookConfig = {
//     framework: 'storybook-react-rsbuild',
//     rsbuildFinal: makeStorybookRsbuildConfig({ basePath: 'src' }),
//   };
//
// `rsbuildFinal` receives the Rsbuild config Storybook would otherwise use
// and returns a merged config combining our base + storybook-specific bits.
export default function makeStorybookRsbuildConfig(options = {}) {
  const baseConfig = makeConfig(options);
  return storybookConfig => {
    return mergeConfigs(baseConfig, storybookConfig);
  };
}

// Shallow merge that prefers our base for app-level concerns (resolve, output,
// plugins) but keeps Storybook-supplied entries (entry, html, dev server).
function mergeConfigs(base, storybookConfig) {
  const merged = { ...base };

  merged.source = {
    ...(base.source ?? {}),
    ...(storybookConfig?.source ?? {}),
    entry: storybookConfig?.source?.entry ?? base.source?.entry,
  };

  merged.output = {
    ...(base.output ?? {}),
    ...(storybookConfig?.output ?? {}),
  };

  merged.html = storybookConfig?.html ?? base.html;
  merged.server = storybookConfig?.server ?? base.server;
  merged.dev = storybookConfig?.dev ?? base.dev;

  merged.plugins = [
    ...(base.plugins ?? []),
    ...(storybookConfig?.plugins ?? []),
  ];

  // Tools: chain bundlerChain / rspack hooks so both apply.
  const baseTools = base.tools ?? {};
  const sbTools = storybookConfig?.tools ?? {};
  merged.tools = {
    ...baseTools,
    ...sbTools,
    bundlerChain: chainHooks(baseTools.bundlerChain, sbTools.bundlerChain),
    rspack: chainHooks(baseTools.rspack, sbTools.rspack),
  };

  return merged;
}

function chainHooks(a, b) {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  return async (config, utils) => {
    if (typeof a === 'function') await a(config, utils);
    else if (a && typeof a === 'object') Object.assign(config, a);
    if (typeof b === 'function') {
      const result = await b(config, utils);
      if (result) return result;
    } else if (b && typeof b === 'object') {
      Object.assign(config, b);
    }
    return config;
  };
}
