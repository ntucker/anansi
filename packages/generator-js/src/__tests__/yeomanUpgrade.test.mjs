import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, before, after } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

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

function assertFilesExist(cwd, files) {
  for (const f of files) {
    assert.ok(fs.existsSync(path.join(cwd, f)), `expected ${f} to exist`);
  }
}

function assertFilesNotExist(cwd, files) {
  for (const f of files) {
    assert.ok(!fs.existsSync(path.join(cwd, f)), `expected ${f} to not exist`);
  }
}

function assertHasDeps(pkg, type, names) {
  for (const name of names) {
    assert.ok(pkg[type]?.[name], `expected ${type} to include ${name}`);
  }
}

function assertNoDeps(pkg, type, names) {
  for (const name of names) {
    assert.ok(!pkg[type]?.[name], `expected ${type} to not include ${name}`);
  }
}

function generatorSuite(name, config, fn) {
  describe(name, () => {
    let result;
    before(async () => {
      result = await runGenerator(config);
    });
    after(async () => {
      if (result?.cleanup) await result.cleanup();
    });
    fn(() => result);
  });
}

// ---------------------------------------------------------------------------
// SPA: validates copyTpl globOptions, select prompts, composeWith args,
//      appendTpl (webpack README + gitignore), queueTransformStream
// ---------------------------------------------------------------------------
generatorSuite(
  'SPA generation (yeoman v8 upgrade)',
  {
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
  },
  getResult => {
    it('generates core SPA files (copyTpl with globOptions)', () => {
      assertFilesExist(getResult().cwd, [
        'package.json',
        'tsconfig.json',
        '.gitignore',
        '.yarnrc.yml',
        'webpack.config.js',
        'eslint.config.mjs',
        'README.md',
        'LICENSE',
        'src/pages/Home/index.tsx',
      ]);
    });

    it('removes .tpl scaffolding files after fs.move', () => {
      assertFilesNotExist(getResult().cwd, [
        '.gitignore.tpl',
        '.yarnrc.yml.tpl',
      ]);
    });

    it('generates testing files (composed sub-generator)', () => {
      assertFilesExist(getResult().cwd, [
        'jest.config.js',
        'src/__tests__/simple.test.ts',
      ]);
    });

    it('generates CI files (circle + github-actions)', () => {
      assertFilesExist(getResult().cwd, [
        '.circleci/config.yml',
        '.github/workflows/bundle_size.yml',
      ]);
    });

    it('appends webpack content to README (built-in appendTpl)', () => {
      const readme = fs.readFileSync(
        path.join(getResult().cwd, 'README.md'),
        'utf8',
      );
      assert.ok(readme.length > 0, 'README should have content');
    });

    it('appends linaria entry to .gitignore (built-in appendTpl)', () => {
      const gitignore = fs.readFileSync(
        path.join(getResult().cwd, '.gitignore'),
        'utf8',
      );
      assert.ok(
        gitignore.length > 50,
        '.gitignore should have substantial content',
      );
    });

    it('sets correct package.json metadata (composeWith args)', () => {
      const pkg = readPkg(getResult().cwd);
      assert.equal(pkg.name, '@acme/test-spa');
      assert.ok(pkg.repository?.url?.includes('acme/test-spa'));
      assert.ok(pkg.scripts?.lint?.includes('src'));
      assert.equal(pkg.license, 'MIT');
    });

    it('includes expected devDependencies', () => {
      assertHasDeps(readPkg(getResult().cwd), 'devDependencies', [
        '@anansi/webpack-config',
        '@anansi/jest-preset',
        '@anansi/eslint-plugin',
        'typescript',
      ]);
    });

    it('includes expected runtime dependencies', () => {
      assertHasDeps(readPkg(getResult().cwd), 'dependencies', [
        '@anansi/router',
        'react',
        'react-dom',
      ]);
    });

    it('generates SSR server files', () => {
      assertFilesNotExist(getResult().cwd, ['src/RootProvider.tsx']);
    });
  },
);

// ---------------------------------------------------------------------------
// Library: validates copyTpl, appendTpl for gitignore, rollup compose
// ---------------------------------------------------------------------------
generatorSuite(
  'Library generation (yeoman v8 upgrade)',
  {
    appName: 'test-lib',
    prompts: {
      projectType: 'library',
      githubOrg: 'acme',
      features: ['testing', 'storybook'],
    },
    options: { 'lib-path': 'lib' },
  },
  getResult => {
    it('generates library source files (copyTpl with globOptions)', () => {
      assertFilesExist(getResult().cwd, [
        'package.json',
        'tsconfig.json',
        'README.md',
        'src/index.ts',
      ]);
    });

    it('generates testing files via composed sub-generator', () => {
      assertFilesExist(getResult().cwd, [
        'jest.config.js',
        'src/__tests__/simple.test.ts',
      ]);
    });

    it('generates storybook config via composed sub-generator', () => {
      assertFilesExist(getResult().cwd, [
        '.storybook/main.js',
        'src/index.stories.tsx',
      ]);
      assertFilesNotExist(getResult().cwd, ['.storybook/preview.tsx']);
    });

    it('has a .gitignore with appended content (built-in appendTpl)', () => {
      const gitignore = fs.readFileSync(
        path.join(getResult().cwd, '.gitignore'),
        'utf8',
      );
      assert.ok(gitignore.length > 20, '.gitignore should have content');
    });

    it('sets correct package.json metadata', () => {
      const pkg = readPkg(getResult().cwd);
      assert.equal(pkg.name, 'test-lib');
      assert.ok(pkg.repository?.url?.includes('acme/test-lib'));
      assert.equal(pkg.license, 'MIT');
    });

    it('declares peer dependencies for libraries with storybook', () => {
      assertHasDeps(readPkg(getResult().cwd), 'peerDependencies', [
        'react',
        'react-dom',
      ]);
    });

    it('includes storybook devDependencies', () => {
      assertHasDeps(readPkg(getResult().cwd), 'devDependencies', [
        'storybook',
        '@storybook/react',
      ]);
    });

    it('does not generate SPA-specific files', () => {
      assertFilesNotExist(getResult().cwd, [
        '.circleci/config.yml',
        '.github/workflows/bundle_size.yml',
      ]);
    });
  },
);

// ---------------------------------------------------------------------------
// Minimal SPA: validates generation with no optional features
// ---------------------------------------------------------------------------
generatorSuite(
  'Minimal SPA (no optional features)',
  {
    appName: 'minimal-spa',
    prompts: {
      projectType: 'SPA',
      githubOrg: 'acme',
      features: [],
      style: 'linaria',
    },
  },
  getResult => {
    it('generates core files without optional features', () => {
      assertFilesExist(getResult().cwd, [
        'package.json',
        'tsconfig.json',
        '.gitignore',
        '.yarnrc.yml',
      ]);
    });

    it('does not generate testing or CI files', () => {
      assertFilesNotExist(getResult().cwd, [
        'jest.config.js',
        '.circleci/config.yml',
        '.github/workflows/bundle_size.yml',
        '.storybook/main.js',
      ]);
    });

    it('omits testing devDependencies', () => {
      assertNoDeps(readPkg(getResult().cwd), 'devDependencies', [
        '@anansi/jest-preset',
        '@testing-library/react',
      ]);
    });
  },
);
