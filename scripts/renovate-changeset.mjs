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

const lines = new Set();
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
  for (const [dep, range] of changed) lines.add(`Update \`${dep}\` to ${range}`);
}

const slug = HEAD_REF.replace(/^renovate\//, '').replace(/[^a-z0-9]+/gi, '-');
const path = `.changeset/renovate-${slug}.md`;
const byName = (a, b) => a.localeCompare(b);

if (names.length) {
  const frontmatter = names.toSorted(byName).map(name => `'${name}': patch`);
  const summary = [...lines].toSorted(byName);
  writeFileSync(path, `---\n${frontmatter.join('\n')}\n---\n\n${summary.join('\n')}\n`);
  console.log(`Wrote ${path} for ${names.join(', ')}`);
} else {
  // drop a changeset from an earlier push whose dependency change is gone
  rmSync(path, { force: true });
  console.log('No published dependencies changed; no changeset needed.');
}
