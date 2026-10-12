#!/usr/bin/env node
// Mirrors the Cursor rules for Claude Code so both harnesses get the same
// steering from one source: every `.cursor/rules/<name>.mdc` becomes
// `.claude/rules/<name>.md` with its `globs` as Claude's `paths`.
//
// Usage: node scripts/agent-rules.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const SOURCE_DIR = '.cursor/rules';
const OUTPUT_DIR = '.claude/rules';

const list = (dir, ext) =>
  fs.existsSync(path.join(root, dir)) ?
    fs
      .readdirSync(path.join(root, dir))
      .filter(name => name.endsWith(ext))
      .map(name => `${dir}/${name}`)
  : [];

const problems = [];
/** @type {Map<string, string>} output path -> content */
const outputs = new Map();

for (const source of list(SOURCE_DIR, '.mdc')) {
  const text = fs.readFileSync(path.join(root, source), 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) {
    problems.push(`${source}: missing frontmatter`);
    continue;
  }
  // Cursor's own frontmatter: single-line `key: value`, `globs` comma-separated
  const meta = Object.fromEntries(
    match[1]
      .split('\n')
      .map(line => /^(\w+):\s*(.*)$/.exec(line))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim()]),
  );
  const globs = (meta.globs ?? '')
    .split(',')
    .map(glob => glob.trim())
    .filter(Boolean);
  const alwaysApply = meta.alwaysApply === 'true';
  if (!alwaysApply && !globs.length) {
    problems.push(
      `${source}: rules need \`globs\` or \`alwaysApply: true\`. Claude Code has no description-only rules`,
    );
    continue;
  }
  const frontmatter =
    alwaysApply ? '' : (
      `---\npaths:\n${globs.map(glob => `  - ${JSON.stringify(glob)}\n`).join('')}---\n`
    );
  outputs.set(
    `${OUTPUT_DIR}/${path.basename(source, '.mdc')}.md`,
    `${frontmatter}<!-- Generated from ${source} by \`yarn build:agent-rules\`. Edit the source. -->\n\n${text.slice(match[0].length)}`,
  );
}

const changed = [];
for (const file of list(OUTPUT_DIR, '.md')) {
  if (outputs.has(file)) continue;
  changed.push(`${file} (no source rule)`);
  if (!check) fs.rmSync(path.join(root, file));
}
for (const [file, content] of outputs) {
  const abs = path.join(root, file);
  if (fs.existsSync(abs) && fs.readFileSync(abs, 'utf8') === content) continue;
  changed.push(file);
  if (!check) {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
if (check && changed.length) {
  console.error(
    `Claude Code rules are out of date with the Cursor rules. Run \`yarn build:agent-rules\` and commit:\n${changed.join('\n')}`,
  );
  process.exit(1);
}
console.log(
  changed.length ?
    `Updated:\n${changed.join('\n')}`
  : 'Claude Code rules are up to date.',
);
