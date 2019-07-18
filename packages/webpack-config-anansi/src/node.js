import path from 'path';
import nodeExternals from 'webpack-node-externals';

export default function makeNodeConfig(baseConfig, { rootPath, serverDir }) {
  const config = { ...baseConfig };
  config.target = 'node';
  if (config.optimization) {
    config.optimization.minimize = false;
    config.optimization.splitChunks = {};
    config.optimization.runtimeChunk = false;
  }
  config.externals = [nodeExternals()];
  config.output.path = path.join(rootPath, serverDir);
  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].chunk.js';
  delete config.output.globalObject;
  config.output.libraryTarget = 'commonjs2';

  return config;
}
