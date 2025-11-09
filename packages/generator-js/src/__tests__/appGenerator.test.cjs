const { beforeAll, describe, expect, it } = require('@jest/globals');
const { execFile } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');
const assert = require('yeoman-assert');

const execFileAsync = promisify(execFile);

function findPackageRoot(start) {
  let dir = start;
  const { root } = path.parse(dir);

  while (dir !== root) {
    const packageJsonPath = path.join(dir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (pkg.name === '@anansi/generator-js') {
          return dir;
        }
      } catch {
        // ignore parse errors and keep traversing
      }
    }
    dir = path.dirname(dir);
  }

  throw new Error('Unable to locate @anansi/generator-js package root');
}

const PACKAGE_ROOT = findPackageRoot(process.cwd());
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '..', '..');
const GENERATOR_ENTRY = path.resolve(PACKAGE_ROOT, 'generators/app');

let buildPromise;
let helpersPromise;

async function ensureGeneratorBuilt() {
  if (!buildPromise) {
    buildPromise = execFileAsync(
      'yarn',
      ['workspace', '@anansi/generator-js', 'build'],
      {
        cwd: REPO_ROOT,
        env: {
          ...process.env,
          NODE_ENV: process.env.NODE_ENV ?? 'test',
        },
      },
    ).then(() => undefined);
  }
  await buildPromise;
}

async function getYeomanTest() {
  helpersPromise ??= import('yeoman-test').then(module => module.default);
  return helpersPromise;
}

function withinDirectory(dir, assertions) {
  const previous = process.cwd();
  process.chdir(dir);
  try {
    assertions();
  } finally {
    process.chdir(previous);
  }
}

async function runAppGenerator({ appName, prompts, options = {} }) {
  await ensureGeneratorBuilt();
  const helpers = await getYeomanTest();
  const promptAnswers = { license: 'MIT', ...prompts };
  return helpers
    .run(GENERATOR_ENTRY)
    .withArguments([appName])
    .withOptions({
      skipInstall: true,
      'skip-install': true,
      githubDomain: 'github.com',
      defaultLicense: 'MIT',
      ...options,
    })
    .withPrompts(promptAnswers);
}

describe('App generator', () => {
  describe('SPA project', () => {
    let result;

    beforeAll(async () => {
      result = await runAppGenerator({
        appName: 'demo-app',
        prompts: {
          projectType: 'SPA',
          githubOrg: 'demo-inc',
          features: ['SSR', 'testing', 'CI'],
        },
        options: {
          'npm-namespace': '@demo',
          'root-path': 'src',
          'build-path': 'dist',
          'server-path': 'server',
        },
      });
    });

    it('creates core project files and directories', () => {
      withinDirectory(result.cwd, () => {
        assert.file([
          'package.json',
          'tsconfig.json',
          '.gitignore',
          '.yarnrc.yml',
          '.circleci/config.yml',
          '.github/workflows/bundle_size.yml',
          'src/pages/Home/index.tsx',
          'src/__tests__/simple.test.ts',
        ]);
        assert.noFile(['.gitignore.tpl', '.yarnrc.yml.tpl']);
      });
    });

    it('fills template placeholders based on prompts and options', () => {
      const packageJsonPath = path.join(result.cwd, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      expect(pkg.name).toBe('@demo/demo-app');
      expect(pkg.repository).toEqual({
        type: 'git',
        url: 'git+ssh://git@github.com/demo-inc/demo-app.git',
      });
      expect(pkg.homepage).toBe('https://github.com/demo-inc/demo-app#readme');
      expect(pkg.scripts.lint).toBe('eslint src --quiet');
      expect(pkg.devDependencies).toMatchObject({
        '@anansi/babel-preset': expect.any(String),
        '@anansi/eslint-plugin': expect.any(String),
        '@anansi/jest-preset': expect.any(String),
        jest: expect.any(String),
        typescript: expect.any(String),
      });
    });

    it('enables generator-specific testing configuration', () => {
      const jestConfig = fs.readFileSync(
        path.join(result.cwd, 'jest.config.js'),
        'utf8',
      );

      expect(jestConfig).toContain('@anansi/jest-preset');

      withinDirectory(result.cwd, () => {
        assert.fileContent('src/__tests__/simple.test.ts', 'describe(');
      });
    });
  });

  describe('Library project with Storybook', () => {
    let result;

    beforeAll(async () => {
      result = await runAppGenerator({
        appName: 'demo-lib',
        prompts: {
          projectType: 'library',
          githubOrg: 'demo-inc',
          features: ['testing', 'storybook'],
        },
        options: {
          'lib-path': 'lib',
        },
      });
    });

    it('scaffolds library-focused sources and omits spa-only files', () => {
      withinDirectory(result.cwd, () => {
        assert.file(['src/index.ts', 'README.md']);
        assert.noFile(['src/pages/Home/index.tsx', '.circleci/config.yml']);
      });
    });

    it('adds storybook peer dependency expectations', () => {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(result.cwd, 'package.json'), 'utf8'),
      );

      expect(pkg.peerDependencies).toMatchObject({
        react: '^18.0.0',
        'react-dom': '^18.0.0',
      });
      expect(pkg.devDependencies).toMatchObject({
        '@types/react': expect.any(String),
        '@types/react-dom': expect.any(String),
        react: expect.any(String),
        'react-dom': expect.any(String),
      });
      expect(pkg.scripts).toMatchObject({
        'build:lib': expect.stringContaining('babel'),
      });
    });
  });
});
