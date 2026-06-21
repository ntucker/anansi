// Inject @wyw-in-js/webpack-loader into the JS rule via tools.bundlerChain.
//
// WyW must run on the original source so it can evaluate template literals
// and extract CSS before SWC/Babel mangle the AST. In a webpack/rspack loader
// chain, "first to run" is the LAST entry in the use array (loaders apply
// right-to-left). We therefore add 'wyw-in-js' AFTER both the SWC and Babel
// uses in the chain so it executes first.
//
// See https://wyw-in-js.dev/bundlers/rspack for the canonical guidance.
export function buildWywChain({ inJSOptions, babelOptions, hasBabel }) {
  return (chain, { CHAIN_ID }) => {
    const wywLoader = require.resolve('@wyw-in-js/webpack-loader');
    const ruleId = CHAIN_ID.RULE.JS;
    const oneOfId =
      CHAIN_ID.ONE_OF && CHAIN_ID.ONE_OF.JS_MAIN ?
        CHAIN_ID.ONE_OF.JS_MAIN
      : null;

    let target = chain.module.rule(ruleId);
    if (oneOfId && target.oneOfs.has(oneOfId)) {
      target = target.oneOf(oneOfId);
    }

    const wywUse = target.use('wyw-in-js');
    wywUse.loader(wywLoader);
    wywUse.options({
      babelOptions,
      ...inJSOptions,
    });
    // Position wyw AFTER the existing SWC/Babel uses in the array so it
    // runs first at loader-execution time.
    const anchor =
      hasBabel && CHAIN_ID.USE.BABEL ? CHAIN_ID.USE.BABEL : CHAIN_ID.USE.SWC;
    if (anchor) {
      try {
        wywUse.after(anchor);
      } catch {
        // anchor not present yet; rspack-chain will keep the use at its
        // initial position which is still valid.
      }
    }
  };
}
