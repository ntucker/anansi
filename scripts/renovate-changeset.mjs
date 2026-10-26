// Writes a patch changeset for Renovate PRs that change a published package's
// runtime `dependencies`. Deterministic, so reruns on the same diff are no-ops.
// Diffs against the merge-base with origin/master, so a stale or moved base
// never shows master's own changes as this PR's. Run from the PR branch checkout.
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';

const git = (...args) => execFileSync('/usr/bin/git', args, { encoding: 'utf8' }).trim();
const BASE_SHA = git('merge-base', 'origin/master', 'HEAD');
const HEAD_REF = git('rev-parse', '--abbrev-ref', 'HEAD');

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

const slug = HEAD_REF.replace(/^renovate\//, '').replace(/[^a-z0-9]+/gi, '-');

if (!names.length) {
  // drop a changeset from an earlier push whose dependency change is gone
  rmSync(`.changeset/renovate-${slug}.md`, { force: true });
  console.log('No published dependencies changed; no changeset needed.');
  process.exit(0);
}

const frontmatter = names.sort().map(name => `'${name}': patch`);
writeFileSync(
  `.changeset/renovate-${slug}.md`,
  `---\n${frontmatter.join('\n')}\n---\n\n${[...new Set(lines)].sort().join('\n')}\n`,
);
console.log(`Wrote .changeset/renovate-${slug}.md for ${names.join(', ')}`);
