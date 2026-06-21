import path from 'path';

// Node target build: equivalent of webpack-config-anansi/src/node.js. Sets
// target=node, externals (we keep our local CSS/SVG modules in the bundle so
// SSR works), output paths, and disables splitChunks/runtimeChunk.
export function applyNode(config, options) {
  const { rootPath, serverDir, pkg, library, libraryInclude } = options;

  config.output ||= {};
  config.output.target = 'node';
  config.output.minify = false;
  config.splitChunks = false;
  config.performance ||= {};
  config.performance.chunkSplit = { strategy: 'all-in-one' };

  const outputPath =
    (pkg?.publishConfig?.main ?? pkg?.main) ?
      rootPath
    : path.join(rootPath, serverDir);
  config.output.distPath = { root: outputPath };
  config.output.filename = config.output.filename || {};
  config.output.filename.js =
    pkg?.publishConfig?.main ?? pkg?.main ?? '[name].js';

  config.output.library = {
    type: 'commonjs2',
  };

  config.output.externals = [
    function ({ context, request, contextInfo, getResolve }, callback) {
      // svgr + linaria have issues with require('react'); embed it for SVGs.
      if (request === 'react' && contextInfo?.issuer?.endsWith('.svg')) {
        return callback();
      }
      // Bundle CSS / SVG so SSR can see styles inlined.
      if (!pkg && !library) {
        if (/\.(svg|css)$/.test(request) || /\.css!=!/.test(request)) {
          return callback();
        }
      }
      // Allow @babel/runtime and the consumer-supplied include list to be bundled.
      if (/^@babel\/runtime/.test(request)) {
        return callback();
      }
      if (libraryInclude) {
        const matches =
          typeof libraryInclude === 'function' ? libraryInclude(request)
          : libraryInclude instanceof RegExp ? libraryInclude.test(request)
          : false;
        if (matches) return callback();
      }
      // Bare imports from node_modules: externalise as commonjs.
      if (/^[^./]/.test(request) && !request.startsWith('!')) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    },
  ];

  return config;
}
