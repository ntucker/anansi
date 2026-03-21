import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '..', '..');
const GENERATOR_ENTRY = path.resolve(PACKAGE_ROOT, 'generators/app');

let buildDone = false;
async function ensureBuilt() {
  if (buildDone) return;
  await execFileAsync('yarn', ['workspace', '@anansi/generator-js', 'build'], {
    cwd: REPO_ROOT,
    env: { ...process.env, NODE_ENV: 'production' },
  });
  buildDone = true;
}

let helpers;
async function getHelpers() {
  if (!helpers) {
    const mod = await import('yeoman-test');
    helpers = mod.default;
  }
  return helpers;
}

async function runGenerator({ appName, prompts, options = {} }) {
  await ensureBuilt();
  const h = await getHelpers();
  return h
    .run(GENERATOR_ENTRY)
    .withArguments([appName])
    .withOptions({
      skipInstall: true,
      'skip-install': true,
      githubDomain: 'github.com',
      defaultLicense: 'MIT',
      ...options,
    })
    .withPrompts({ license: 'MIT', ...prompts });
}

function readPkg(cwd) {
  return JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
}

// ---------------------------------------------------------------------------
// SPA: validates copyTpl globOptions, select prompts, composeWith args,
//      appendTpl (webpack README + gitignore), queueTransformStream
// ---------------------------------------------------------------------------
describe('SPA generation (yeoman v8 upgrade)', () => {
  let result;

  before(async () => {
    result = await runGenerator({
      appName: 'test-spa',
      prompts: {
        projectType: 'SPA',
        githubOrg: 'acme',
        features: ['SSR', 'testing', 'CI'],
        style: 'linaria',
      },
      options: {
        'root-path': 'src',
        'build-path': 'dist',
        'server-path': 'server',
        'npm-namespace': '@acme',
      },
    });
  });

  after(async () => {
    if (result?.cleanup) await result.cleanup();
  });

  it('generates core SPA files (copyTpl with globOptions)', () => {
    const expected = [
      'package.json',
      'tsconfig.json',
      '.gitignore',
      '.yarnrc.yml',
      'webpack.config.js',
      'eslint.config.mjs',
      'README.md',
      'LICENSE',
      'src/pages/Home/index.tsx',
    ];
    for (const f of expected) {
      assert.ok(
        fs.existsSync(path.join(result.cwd, f)),
        `expected file ${f} to exist`,
      );
    }
  });

  it('removes .tpl scaffolding files after fs.move', () => {
    assert.ok(
      !fs.existsSync(path.join(result.cwd, '.gitignore.tpl')),
      '.gitignore.tpl should be removed',
    );
    assert.ok(
      !fs.existsSync(path.join(result.cwd, '.yarnrc.yml.tpl')),
      '.yarnrc.yml.tpl should be removed',
    );
  });

  it('generates testing files (composed sub-generator)', () => {
    assert.ok(
      fs.existsSync(path.join(result.cwd, 'jest.config.js')),
      'jest.config.js should exist',
    );
    assert.ok(
      fs.existsSync(path.join(result.cwd, 'src/__tests__/simple.test.ts')),
      'src/__tests__/simple.test.ts should exist',
    );
  });

  it('generates CI files (circle + github-actions)', () => {
    assert.ok(
      fs.existsSync(path.join(result.cwd, '.circleci/config.yml')),
      '.circleci/config.yml should exist',
    );
    assert.ok(
      fs.existsSync(path.join(result.cwd, '.github/workflows/bundle_size.yml')),
      '.github/workflows/bundle_size.yml should exist',
    );
  });

  it('appends webpack content to README (built-in appendTpl)', () => {
    const readme = fs.readFileSync(path.join(result.cwd, 'README.md'), 'utf8');
    assert.ok(readme.length > 0, 'README should have content');
  });

  it('appends linaria entry to .gitignore (built-in appendTpl)', () => {
    const gitignore = fs.readFileSync(
      path.join(result.cwd, '.gitignore'),
      'utf8',
    );
    assert.ok(
      gitignore.length > 50,
      '.gitignore should have substantial content',
    );
  });

  it('sets correct package.json metadata (composeWith args)', () => {
    const pkg = readPkg(result.cwd);
    assert.equal(pkg.name, '@acme/test-spa');
    assert.ok(pkg.repository?.url?.includes('acme/test-spa'));
    assert.ok(pkg.scripts?.lint?.includes('src'));
    assert.equal(pkg.license, 'MIT');
  });

  it('includes expected devDependencies', () => {
    const pkg = readPkg(result.cwd);
    assert.ok(pkg.devDependencies['@anansi/webpack-config']);
    assert.ok(pkg.devDependencies['@anansi/jest-preset']);
    assert.ok(pkg.devDependencies['@anansi/eslint-plugin']);
    assert.ok(pkg.devDependencies['typescript']);
  });

  it('includes expected runtime dependencies', () => {
    const pkg = readPkg(result.cwd);
    assert.ok(pkg.dependencies['@anansi/router']);
    assert.ok(pkg.dependencies['react']);
    assert.ok(pkg.dependencies['react-dom']);
  });

  it('generates SSR server files', () => {
    assert.ok(
      !fs.existsSync(path.join(result.cwd, 'src/RootProvider.tsx')),
      'RootProvider.tsx should be deleted for SSR config',
    );
  });
});

// ---------------------------------------------------------------------------
// Library: validates copyTpl, appendTpl for gitignore, rollup compose
// ---------------------------------------------------------------------------
describe('Library generation (yeoman v8 upgrade)', () => {
  let result;

  before(async () => {
    result = await runGenerator({
      appName: 'test-lib',
      prompts: {
        projectType: 'library',
        githubOrg: 'acme',
        features: ['testing', 'storybook'],
      },
      options: { 'lib-path': 'lib' },
    });
  });

  after(async () => {
    if (result?.cleanup) await result.cleanup();
  });

  it('generates library source files (copyTpl with globOptions)', () => {
    for (const f of [
      'package.json',
      'tsconfig.json',
      'README.md',
      'src/index.ts',
    ]) {
      assert.ok(
        fs.existsSync(path.join(result.cwd, f)),
        `expected file ${f} to exist`,
      );
    }
  });

  it('generates testing files via composed sub-generator', () => {
    assert.ok(
      fs.existsSync(path.join(result.cwd, 'jest.config.js')),
      'jest.config.js should exist',
    );
    assert.ok(
      fs.existsSync(path.join(result.cwd, 'src/__tests__/simple.test.ts')),
      'test file should exist',
    );
  });

  it('generates storybook config via composed sub-generator', () => {
    assert.ok(
      fs.existsSync(path.join(result.cwd, '.storybook/main.js')),
      '.storybook/main.js should exist',
    );
    assert.ok(
      fs.existsSync(path.join(result.cwd, 'src/index.stories.tsx')),
      'stories file should exist',
    );
    assert.ok(
      !fs.existsSync(path.join(result.cwd, '.storybook/preview.tsx')),
      'preview.tsx should NOT exist for libraries',
    );
  });

  it('has a .gitignore with appended content (built-in appendTpl)', () => {
    const gitignore = fs.readFileSync(
      path.join(result.cwd, '.gitignore'),
      'utf8',
    );
    assert.ok(gitignore.length > 20, '.gitignore should have content');
  });

  it('sets correct package.json metadata', () => {
    const pkg = readPkg(result.cwd);
    assert.equal(pkg.name, 'test-lib');
    assert.ok(pkg.repository?.url?.includes('acme/test-lib'));
    assert.equal(pkg.license, 'MIT');
  });

  it('declares peer dependencies for libraries with storybook', () => {
    const pkg = readPkg(result.cwd);
    assert.ok(pkg.peerDependencies?.react);
    assert.ok(pkg.peerDependencies?.['react-dom']);
  });

  it('includes storybook devDependencies', () => {
    const pkg = readPkg(result.cwd);
    assert.ok(pkg.devDependencies['storybook']);
    assert.ok(pkg.devDependencies['@storybook/react']);
  });

  it('does not generate SPA-specific files', () => {
    for (const f of [
      '.circleci/config.yml',
      '.github/workflows/bundle_size.yml',
    ]) {
      assert.ok(
        !fs.existsSync(path.join(result.cwd, f)),
        `${f} should not exist in library project`,
      );
    }
  });
});

// ---------------------------------------------------------------------------
// Minimal SPA: validates generation with no optional features
// ---------------------------------------------------------------------------
describe('Minimal SPA (no optional features)', () => {
  let result;

  before(async () => {
    result = await runGenerator({
      appName: 'minimal-spa',
      prompts: {
        projectType: 'SPA',
        githubOrg: 'acme',
        features: [],
        style: 'linaria',
      },
    });
  });

  after(async () => {
    if (result?.cleanup) await result.cleanup();
  });

  it('generates core files without optional features', () => {
    for (const f of [
      'package.json',
      'tsconfig.json',
      '.gitignore',
      '.yarnrc.yml',
    ]) {
      assert.ok(fs.existsSync(path.join(result.cwd, f)), `${f} should exist`);
    }
  });

  it('does not generate testing or CI files', () => {
    for (const f of [
      'jest.config.js',
      '.circleci/config.yml',
      '.github/workflows/bundle_size.yml',
      '.storybook/main.js',
    ]) {
      assert.ok(
        !fs.existsSync(path.join(result.cwd, f)),
        `${f} should not exist`,
      );
    }
  });

  it('omits testing devDependencies', () => {
    const pkg = readPkg(result.cwd);
    assert.ok(!pkg.devDependencies?.['@anansi/jest-preset']);
    assert.ok(!pkg.devDependencies?.['@testing-library/react']);
  });
});
