import path from 'path';

import { ROOT_PATH } from '~/base/constants';

import { getStyleRules } from './base';


export default function makeNobuildConfig(baseConfig, { basePath }) {
  const config = { ...baseConfig };
  config.output = {
    path: path.join(ROOT_PATH, 'tmpbuild'),
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
    basePath,
  });
  config.module.rules = [...config.module.rules, ...styleRules];
  return config;
}
