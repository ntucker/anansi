// extracted from https://github.com/webpack/node-libs-browser/blob/master/index.js
export const NODE_ALIAS = {
  stream: require.resolve('stream-browserify'),
  path: require.resolve('path-browserify'),
  crypto: require.resolve('crypto-browserify'),
  buffer: require.resolve('buffer/'),
  vm: require.resolve('vm-browserify'),
  assert: require.resolve('assert/'),
  console: require.resolve('console-browserify'),
  constants: require.resolve('constants-browserify'),
  domain: require.resolve('domain-browser'),
  events: require.resolve('events/'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser.js'),
  process: require.resolve('process/browser.js'),
  querystring: require.resolve('querystring-es3/'),
  _stream_duplex: require.resolve('readable-stream/lib/_stream_duplex.js'),
  _stream_passthrough: require.resolve(
    'readable-stream/lib/_stream_passthrough.js',
  ),
  _stream_readable: require.resolve('readable-stream/lib/_stream_readable.js'),
  _stream_transform: require.resolve(
    'readable-stream/lib/_stream_transform.js',
  ),
  _stream_writable: require.resolve('readable-stream/lib/_stream_writable.js'),
  string_decoder: require.resolve('string_decoder/'),
  sys: require.resolve('util/util.js'),
  timers: require.resolve('timers-browserify'),
  tty: require.resolve('tty-browserify'),
  url: require.resolve('url/'),
  util: require.resolve('util/util.js'),
  zlib: require.resolve('browserify-zlib'),
};
