#!/usr/bin/env node
/**
 * Creates GitHub releases for published packages.
 * Scans all packages, checks if a release already exists for the current version,
 * and creates one if not. Gated in CI by `has-changesets == 'false'` so it only
 * runs after the Version Packages PR is merged and publish executes.
 */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'ntucker/anansi';
// GitHub's "Latest" release, which the repo page and /releases/latest show
const LATEST_PACKAGE = '@anansi/core';
const DRY_RUN = process.argv.includes('--dry-run');
// Tags the released commit; gh would tag the default branch (master) instead
const TARGET = process.env.GITHUB_SHA ? ` --target ${process.env.GITHUB_SHA}` : '';

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

function getChangelogForVersion(packageDir, version) {
  const changelogPath = join(packageDir, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) return '';

  const content = readFileSync(changelogPath, 'utf-8');
  const lines = content.split('\n');

  let capturing = false;
  const changelog = [];
  const versionHeading = new RegExp(
    String.raw`^## ${escapeRegExp(version)}\s*$`,
  );

  for (const line of lines) {
    if (versionHeading.test(line)) {
      capturing = true;
      continue;
    }
    // Stop at the next release heading. Changesets writes `## 1.2.3`.
    // Lerna wrote `## [0.23.0](...)`; a digit-only pattern would swallow
    // that history into the new release notes.
    if (capturing && /^## \[?\d+\.\d+/.test(line)) {
      break;
    }
    if (capturing) {
      changelog.push(line);
    }
  }

  return changelog.join('\n').trim();
}

function releaseExists(tag) {
  try {
    execSync(`gh release view "${tag}" --repo ${REPO}`, {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return true;
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString() : '';
    // `gh release view` prints this and exits 1 when the tag has no release.
    // Any other failure (auth, network, 5xx) must fail the job.
    if (stderr.includes('release not found')) return false;
    throw error;
  }
}

/**
 * GitHub's Latest follows npm's `latest`, so only LATEST_PACKAGE takes it.
 * Every other release passes --latest=false, or GitHub marks whichever was
 * created last.
 */
function isLatest(name, version) {
  return name === LATEST_PACKAGE && !version.includes('-');
}

function createRelease(tag, body, latest) {
  if (DRY_RUN) {
    console.log(
      `  [dry-run] Would create release: ${tag}${latest ? ' (Latest)' : ''}`,
    );
    console.log(
      `  Body preview: ${body.slice(0, 200)}${body.length > 200 ? '...' : ''}`,
    );
    return;
  }
  console.log(`Creating release: ${tag}`);
  try {
    execSync(
      `gh release create "${tag}" --repo ${REPO} --title "${tag}" --notes-file - --latest=${latest}${TARGET}`,
      {
        input: body,
        stdio: ['pipe', 'inherit', 'inherit'],
      },
    );
    console.log(`  ✓ Created ${tag}`);
  } catch (error) {
    console.error(`  ✗ Failed to create ${tag}:`, error.message);
    throw error;
  }
}

/**
 * Creating a release with --latest only affects a release that does not exist
 * yet. Lerna left GitHub's Latest on whichever package it created last, so an
 * already-published @anansi/core release has to be marked explicitly.
 */
function markLatest(tag) {
  if (DRY_RUN) {
    console.log(`  [dry-run] Would mark ${tag} as Latest`);
    return;
  }
  console.log(`Marking ${tag} as Latest`);
  execSync(`gh release edit "${tag}" --repo ${REPO} --latest`, {
    stdio: 'inherit',
  });
}

async function main() {
  if (DRY_RUN)
    console.log('Running in dry-run mode (no releases will be created)\n');
  const packagesDir = join(process.cwd(), 'packages');
  const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => join(packagesDir, d.name));

  let createdCount = 0;
  let skippedCount = 0;

  for (const packageDir of packageDirs) {
    const pkgJsonPath = join(packageDir, 'package.json');
    if (!existsSync(pkgJsonPath)) continue;

    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    if (pkg.private) continue;

    const tag = `${pkg.name}@${pkg.version}`;
    const exists = releaseExists(tag);
    const latest = isLatest(pkg.name, pkg.version);

    if (exists) {
      skippedCount++;
    } else {
      const changelog = getChangelogForVersion(packageDir, pkg.version);
      const body = changelog || `Release ${pkg.name}@${pkg.version}`;
      createRelease(tag, body, latest);
      createdCount++;
    }

    if (exists && latest) markLatest(tag);
  }

  console.log(
    `\nDone! Created ${createdCount} releases, skipped ${skippedCount} existing.`,
  );
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
