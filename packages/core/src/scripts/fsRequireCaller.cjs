const { createHash } = require('crypto');
const fs = require('fs');
const { createRequire } = require('module');
const path = require('path');

// This file lives in the package (src/scripts and lib/scripts). Resolving
// fs-require from here finds the copy @anansi/core depends on, not whatever
// happens to be nested beside the app.
const coreRequire = createRequire(__filename);

/**
 * fs-require 2 resolves bare specifiers from the file that called
 * createFsRequire(). That file must sit under the app. A file inside
 * @anansi/core would prefer dependencies nested under this package (the app's
 * Express 4 vs this package's Express 5).
 *
 * @param {string} projectRoot
 * @returns {typeof import('fs-require').createFsRequire}
 */
function createProjectFsRequire(projectRoot) {
  // CommonJS so this loads on Node 22.15 under Jest, which rejects require(esm).
  // The .cjs extension stays CommonJS when the app package is "type": "module".
  const entry = coreRequire.resolve('fs-require');
  const source = [
    `'use strict';`,
    `const { createFsRequire } = require(${JSON.stringify(entry)});`,
    'function createProjectFsRequire(fileSystem, options) {',
    '  return createFsRequire(fileSystem, options);',
    '}',
    'module.exports = { createProjectFsRequire };',
    '',
  ].join('\n');
  const hash = createHash('sha256').update(source).digest('hex').slice(0, 16);
  const file = path.join(
    projectRoot,
    'node_modules',
    '.cache',
    'anansi',
    `fs-require-caller-${hash}.cjs`,
  );
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, source);

  const loaded = coreRequire(file);
  if (typeof loaded.createProjectFsRequire !== 'function') {
    throw new Error('Unable to load the project fs-require caller at ' + file);
  }
  return loaded.createProjectFsRequire;
}

module.exports = { createProjectFsRequire };
