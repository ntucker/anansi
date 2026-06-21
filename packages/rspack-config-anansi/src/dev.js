// Development-mode tweaks: HMR, source maps, dev server.
export function applyDev(config) {
  config.dev ||= {};
  config.dev.hmr = true;
  config.dev.writeToDisk = false;

  // Rsbuild's defaults already cover watch ignores for node_modules, build
  // outputs, and dot-folders. We don't add extra path-based ignored entries
  // here because rspack's watcher requires careful handling of glob/regex/
  // string types.

  return config;
}
