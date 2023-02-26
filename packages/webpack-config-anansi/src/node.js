import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

export default function makeNodeConfig(
  baseConfig,
  { rootPath, serverDir, pkg, library },
) {
  const config = { ...baseConfig };
  config.target = 'node';
  if (!config.optimization) {
    config.optimization = {};
  }
  config.optimization.minimize = false;
  config.optimization.splitChunks = {};
  config.optimization.runtimeChunk = false;
  config.optimization.concatenateModules = true;
  config.optimization.removeEmptyChunks = true;

  config.node = {
    __dirname: true,
    __filename: true,
  };
  config.externalsPresets = { node: true };
  config.externals = [
    nodeExternals({
      allowlist: [
        /@babel\/runtime/,
        ...(pkg || library
          ? []
          : [
              /\.(svg|css)$/,
              /\.css!=!/,
              'react' /* react is needed for svgr */,
            ]),
      ],
      additionalModuleDirs: ['../../node_modules'],
    }),
  ];
  config.output.path =
    pkg?.publishConfig?.main ?? pkg?.main
      ? rootPath
      : path.join(rootPath, serverDir);
  config.output.filename = pkg?.publishConfig?.main ?? pkg?.main ?? '[name].js';
  config.output.chunkFilename = '[name].chunk.js';

  delete config.output.globalObject;

  config.output.library = {
    type: 'commonjs2',
  };

  // don't output stats for server builds as they won't need to reference manifests
  config.plugins = config.plugins.filter(
    plugin => !(plugin instanceof StatsWriterPlugin),
  );

  return config;
}
