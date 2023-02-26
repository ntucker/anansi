export default function makeLibraryConfig(baseConfig, { pkg, library }) {
  const config = { ...baseConfig };

  config.output.library = {
    type: library?.type ?? pkg?.type ?? 'commonjs',
  };
  config.output.chunkFormat = config.output.library.type;
  if (config.output.chunkFormat === 'commonjs2')
    config.output.chunkFormat = 'commonjs';
  else if (config.output.chunkFormat === 'module') {
    if (!config.experiments) {
      config.experiments = {};
    }
    config.experiments.outputModule = true;
  }
  config.devtool = 'inline-source-map';

  return config;
}
