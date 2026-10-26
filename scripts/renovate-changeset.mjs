// Writes a patch changeset for Renovate PRs that change a published package's
// runtime `dependencies`. Deterministic, so reruns on the same diff are no-ops.
// Usage: BASE_SHA=<sha> HEAD_REF=<branch> node scripts/renovate-changeset.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const { BASE_SHA, HEAD_REF } = process.env;
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

const files = git('diff', '--name-only', BASE_SHA, 'HEAD', '--', 'packages/*/package.json')
  .split('\n')
  .filter(Boolean);

const lines = [];
const names = [];
for (const file of files) {
  const next = JSON.parse(readFileSync(file, 'utf8'));
  if (next.private) continue;
  const prev = JSON.parse(git('show', `${BASE_SHA}:${file}`));
  const changed = Object.entries(next.dependencies ?? {}).filter(
    ([dep, range]) => prev.dependencies?.[dep] !== range,
  );
  if (!changed.length) continue;
  names.push(next.name);
  for (const [dep, range] of changed) lines.push(`Update \`${dep}\` to ${range}`);
}

if (!names.length) {
  console.log('No published dependencies changed; no changeset needed.');
  process.exit(0);
}

const slug = HEAD_REF.replace(/^renovate\//, '').replace(/[^a-z0-9]+/gi, '-');
const frontmatter = names.sort().map(name => `'${name}': patch`);
writeFileSync(
  `.changeset/renovate-${slug}.md`,
  `---\n${frontmatter.join('\n')}\n---\n\n${[...new Set(lines)].sort().join('\n')}\n`,
);
console.log(`Wrote .changeset/renovate-${slug}.md for ${names.join(', ')}`);
