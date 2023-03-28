/* eslint-disable @typescript-eslint/no-var-requires */
const pnpResolve = require('jest-pnp-resolver');
const path = require('path');

module.exports = (request: string, options: Record<string, any>) => {
  if (
    options.paths &&
    Array.isArray(options.paths) &&
    !['.', '/'].includes(request[0])
  ) {
    for (const rootPath of options.paths) {
      try {
        const p = path.join(rootPath, request);
        return require.resolve(p);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }

  return pnpResolve(request, options);
};
