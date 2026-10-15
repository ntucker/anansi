// Smoke test: plugin rules must report (and fix) without crashing on the
// installed ESLint, since some plugins only call removed APIs when reporting.
// Also checks how import resolvers are keyed.
import { ESLint } from 'eslint';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';

import plugin from './index.js';
import resolverKey from './resolverKey.cjs';

const source = `import path from 'path';
import { useEffect } from 'react';
import fs from 'fs';

export function List({ items, id }) {
  useEffect(() => {}, [id]);
  return <ul>{items.map(item => <li>{item}</li>)}</ul>;
}
export default [path, fs];
`;

for (const [name, filePath] of [
  ['javascript', 'fixture.jsx'],
  ['typescript', 'fixture.tsx'],
]) {
  test(`${name} config reports and fixes`, async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...plugin.configs[name],
        // the babel parser needs a config; use this repo's
        {
          languageOptions: {
            parserOptions: {
              babelOptions: { root: path.join(import.meta.dirname, '../..') },
            },
          },
        },
      ],
      fix: true,
    });
    const [result] = await eslint.lintText(source, { filePath });
    const ruleIds = result.messages.map(m => m.ruleId);
    assert.ok(ruleIds.includes('react/jsx-key'), ruleIds.join());
    assert.ok(result.output.startsWith("import fs from 'fs';\nimport path"));
  });
}

// under PnP the plugin's resolver is keyed by path, so these don't merge
test(
  'consumer resolver settings merge into the plugin resolver',
  {
    skip: !!process.versions.pnp,
  },
  async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...plugin.configs.typescript,
        { settings: { 'import/resolver': { typescript: { project: 'x' } } } },
      ],
    });
    const config = await eslint.calculateConfigForFile('fixture.tsx');
    assert.deepEqual(config.settings['import/resolver'], {
      typescript: { project: 'x' },
    });
  },
);

test('resolvers are passed by path under Yarn PnP', t => {
  const { pnp } = process.versions;
  t.after(() => {
    if (pnp === undefined) delete process.versions.pnp;
    else process.versions.pnp = pnp;
  });
  process.versions.pnp = '3';
  assert.equal(
    resolverKey('typescript'),
    createRequire(import.meta.url).resolve('eslint-import-resolver-typescript'),
  );
});
