import autoprefixer from 'autoprefixer';
import cssPresetEnv from 'postcss-preset-env';

// Returns an Rsbuild config fragment that customises the built-in CSS
// pipeline:
//   - postcss adds autoprefixer + postcss-preset-env (matches the existing
//     @anansi/webpack-config behaviour)
//   - CSS modules use a deterministic localIdentName scoped by folder
//   - css extraction is honoured / disabled per option
//   - sass / sass-resources are wired via @rsbuild/plugin-sass when enabled
//
// Rsbuild's defaults already pick the right behaviour for plain `.css`
// (including the wyw-in-js `.wyw-in-js.css` output) and for `*.module.css` /
// `*.module.scss`, so we don't override module rules.
export function buildCssOptions({
  cssModulesOptions = {},
  cssExtractOptions,
  mode,
}) {
  const isProd = mode === 'production';
  const localIdentName =
    isProd ? '[hash:base64:8]' : '[folder]_[name]__[local]___[hash:base64:5]';

  const cssModules = {
    localIdentName,
    exportLocalsConvention: 'camelCase',
    ...(process.env.NODE_ENV === 'testing' ?
      { localIdentName: '[name]__[local]' }
    : {}),
    ...cssModulesOptions,
  };

  const tools = {
    postcss: pc => {
      pc.postcssOptions ||= {};
      pc.postcssOptions.plugins = [
        autoprefixer(),
        cssPresetEnv(),
        ...(pc.postcssOptions.plugins ?? []),
      ];
    },
  };

  // CSS extraction: opt out when consumer explicitly disables, otherwise
  // rely on Rsbuild's built-in extraction (`output.injectStyles: false`,
  // which is the default in production).
  const output = { cssModules };
  if (cssExtractOptions === false) {
    output.injectStyles = true;
  } else if (cssExtractOptions && typeof cssExtractOptions === 'object') {
    // Allow filename overrides; Rsbuild's filename.css covers most use-cases.
    if (cssExtractOptions.filename) {
      output.filename = output.filename || {};
      output.filename.css = cssExtractOptions.filename;
    }
  }

  return { tools, output };
}
