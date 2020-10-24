import path from 'path';
import nodeExternals from 'webpack-node-externals';
import StatsPlugin from 'stats-webpack-plugin';

import { NODE_ALIAS } from './base/node-polyfill';

export default function makeNodeConfig(baseConfig, { rootPath, serverDir }) {
  const config = { ...baseConfig };
  config.target = 'node';
  if (config.optimization) {
    config.optimization.minimize = false;
    config.optimization.splitChunks = {};
    config.optimization.runtimeChunk = false;
  }
  config.node = {
    __dirname: true,
    __filename: true,
  };
  config.externals = [nodeExternals()];
  config.output.path = path.join(rootPath, serverDir);
  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].chunk.js';
  delete config.output.globalObject;
  config.output.libraryTarget = 'commonjs2';
  // don't output stats for server builds as they won't need to reference manifests
  config.plugins = config.plugins.filter(
    plugin => !(plugin instanceof StatsPlugin),
  );
  // remove node polyfills as we will execute this in node
  config.path.alias = { ...config.path.alias };
  for (const alias in NODE_ALIAS) {
    delete config.path.alias[alias];
  }

  return config;
}
