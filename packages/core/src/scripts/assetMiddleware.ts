import express from 'express';

/** Serves files in outputPath under publicPath. Misses and traversal attempts
 * fall through to the next handler, since the build output is send's root.
 */
export function assetMiddleware(publicPath: string, outputPath: string) {
  return express.Router().use(
    // escape path-to-regexp v8 syntax so characters like ( : * stay literal
    publicPath.replaceAll(/[()[\]{}*+?!:\\]/g, '\\$&'),
    express.static(outputPath, { index: false, redirect: false }),
  );
}
