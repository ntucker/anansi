import { getStyleRules } from './base';

export default function makeNobuildConfig(
  baseConfig,
  { rootPath, basePath, cssModulesOptions, globalStyleDir, sassOptions },
) {
  const config = { ...baseConfig };
  config.output = {
    path: '/tmp/anansi-build',
  };
  baseConfig.plugins = [];
  config.mode = 'development';
  config.bail = true;
  config.optimization = {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  };
  config.stats = 'minimal';
  const styleRules = getStyleRules({
    rootPath,
    basePath,
    cssModulesOptions,
    sassOptions,
    globalStyleDir,
  });
  config.module.rules = [...config.module.rules, styleRules];
  return config;
}
