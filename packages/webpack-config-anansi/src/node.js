import module from 'module';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

export default function makeNodeConfig(
  baseConfig,
  { rootPath, serverDir, pkg, library, libraryInclude },
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
  const allowlist = [
    /@babel\/runtime/,
    libraryInclude,
    ...(pkg || library ? [] : [/\.(svg|css)$/, /\.css!=!/]),
  ];
  // Yarn PnP has no node_modules to list, so ask its API for the package names
  const pnpApi = module.findPnpApi?.(`${rootPath}/`);
  const externalsFunc =
    pnpApi ?
      pnpExternals(pnpApi, allowlist)
    : nodeExternals({
        allowlist,
        additionalModuleDirs: ['../../node_modules'],
      });
  config.externals = [
    function ({ context, request, contextInfo, getResolve }, callback) {
      // svgr + linaria have issues with require('react')
      // instead we'll detect this specific case and embed it
      if (
        request === 'react' &&
        contextInfo.issuer.substring(contextInfo.issuer.length - 4) === '.svg'
      ) {
        callback();
      } else
        externalsFunc({ context, request, contextInfo, getResolve }, callback);
    },
  ];
  config.output.path =
    (pkg?.publishConfig?.main ?? pkg?.main) ?
      rootPath
    : path.join(rootPath, serverDir);
  config.output.filename = pkg?.publishConfig?.main ?? pkg?.main ?? '[name].js';
  config.output.chunkFilename = '[name].chunk.js';

  delete config.output.globalObject;

  config.output.library = {
    type: 'commonjs2',
  };
  if (!config.output.environment) {
    config.output.environment = {};
  }
  // node12+ supports import()
  config.output.environment.dynamicImport = true;

  // don't output stats for server builds as they won't need to reference manifests
  config.plugins = config.plugins.filter(
    plugin => !(plugin instanceof StatsWriterPlugin),
  );

  return config;
}

// webpack-node-externals' matching, with the package list from Yarn PnP
function pnpExternals(pnpApi, allowlist) {
  const packages = new Set(pnpApi.getAllLocators().map(({ name }) => name));
  const patterns = [/^webpack\/container\/reference\//, ...allowlist];
  return ({ request }, callback) => {
    const [first, second] = request.split('/');
    const name = first.startsWith('@') ? `${first}/${second}` : first;
    if (
      packages.has(name) &&
      !patterns.some(pattern => matches(pattern, request))
    ) {
      return callback(null, `commonjs ${request}`);
    }
    callback();
  };
}

function matches(pattern, request) {
  if (pattern instanceof RegExp) return pattern.test(request);
  if (typeof pattern === 'function') return pattern(request);
  return pattern === request;
}
