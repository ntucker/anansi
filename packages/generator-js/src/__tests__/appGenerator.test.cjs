const { beforeAll, describe, expect, it } = require('@jest/globals');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('yeoman-assert');

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
const GENERATOR_ENTRY = path.resolve(PACKAGE_ROOT, 'generators/app');

let helpersPromise;

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

const SPA_COMMON_FILES = [
  'AGENTS.md',
  'package.json',
  'tsconfig.json',
  '.gitignore',
  '.yarnrc.yml',
  'src/pages/Home/index.tsx',
];

const SPA_SCENARIOS = [
  {
    name: 'with testing and continuous integration',
    appName: 'spa-testing-ci',
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
    expectations: {
      files: [
        ...SPA_COMMON_FILES,
        '.circleci/config.yml',
        '.github/workflows/bundle_size.yml',
        'jest.config.js',
        'src/__tests__/simple.test.ts',
      ],
      absentFiles: ['.gitignore.tpl', '.yarnrc.yml.tpl', '.storybook/main.js'],
      packageChecks(pkg, scenario) {
        expect(pkg.name).toBe(`@demo/${scenario.appName}`);
        expect(pkg.repository).toEqual({
          type: 'git',
          url: `git+ssh://git@github.com/${scenario.prompts.githubOrg}/${scenario.appName}.git`,
        });
        expect(pkg.homepage).toBe(
          `https://github.com/${scenario.prompts.githubOrg}/${scenario.appName}#readme`,
        );
        expect(pkg.scripts.lint).toBe('eslint src --quiet');
        expect(pkg.devDependencies).toMatchObject({
          '@anansi/babel-preset': expect.any(String),
          '@anansi/eslint-plugin': expect.any(String),
          '@anansi/jest-preset': expect.any(String),
          '@testing-library/react': expect.any(String),
          jest: expect.any(String),
        });
      },
      extraChecks(cwd) {
        const jestConfig = fs.readFileSync(
          path.join(cwd, 'jest.config.js'),
          'utf8',
        );
        expect(jestConfig).toContain('@anansi/jest-preset');
        withinDirectory(cwd, () => {
          assert.fileContent('src/__tests__/simple.test.ts', 'describe(');
        });
      },
    },
  },
  {
    name: 'without optional features',
    appName: 'spa-minimal',
    prompts: {
      projectType: 'SPA',
      githubOrg: 'demo-inc',
      features: [],
    },
    options: {},
    expectations: {
      files: [...SPA_COMMON_FILES],
      absentFiles: [
        '.gitignore.tpl',
        '.yarnrc.yml.tpl',
        '.circleci/config.yml',
        '.github/workflows/bundle_size.yml',
        'jest.config.js',
        'src/__tests__/simple.test.ts',
        '.storybook/main.js',
        'src/index.stories.tsx',
      ],
      packageChecks(pkg, scenario) {
        expect(pkg.name).toBe(scenario.appName);
        expect(pkg.devDependencies ?? {}).not.toHaveProperty(
          '@anansi/jest-preset',
        );
        expect(pkg.devDependencies ?? {}).not.toHaveProperty(
          '@testing-library/react',
        );
      },
    },
  },
  {
    name: 'with storybook but no testing',
    appName: 'spa-storybook',
    prompts: {
      projectType: 'SPA',
      githubOrg: 'demo-inc',
      features: ['SSR', 'storybook'],
    },
    options: {},
    expectations: {
      files: [
        ...SPA_COMMON_FILES,
        '.storybook/main.js',
        '.storybook/preview.tsx',
        'src/index.stories.tsx',
      ],
      absentFiles: [
        '.gitignore.tpl',
        '.yarnrc.yml.tpl',
        '.circleci/config.yml',
        '.github/workflows/bundle_size.yml',
        'jest.config.js',
        'src/__tests__/simple.test.ts',
      ],
      packageChecks(pkg, scenario) {
        expect(pkg.name).toBe(scenario.appName);
        expect(pkg.devDependencies).toMatchObject({
          storybook: expect.any(String),
          '@storybook/react': expect.any(String),
          '@storybook/addon-essentials': expect.any(String),
        });
        expect(pkg.devDependencies ?? {}).not.toHaveProperty(
          '@anansi/jest-preset',
        );
      },
    },
  },
];

const LIBRARY_SCENARIOS = [
  {
    name: 'with testing and storybook',
    appName: 'lib-testing-storybook',
    prompts: {
      projectType: 'library',
      githubOrg: 'demo-inc',
      features: ['testing', 'storybook'],
    },
    options: {
      'lib-path': 'lib',
    },
    expectations: {
      files: [
        'AGENTS.md',
        'package.json',
        'tsconfig.json',
        'README.md',
        'src/index.ts',
        'jest.config.js',
        'src/__tests__/simple.test.ts',
        '.storybook/main.js',
        'src/index.stories.tsx',
      ],
      absentFiles: [
        '.circleci/config.yml',
        '.github/workflows/bundle_size.yml',
        '.storybook/preview.tsx',
      ],
      packageChecks(pkg, scenario) {
        expect(pkg.name).toBe(scenario.appName);
        expect(pkg.peerDependencies).toMatchObject({
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        });
        expect(pkg.devDependencies).toMatchObject({
          '@anansi/jest-preset': expect.any(String),
          '@testing-library/react': expect.any(String),
          storybook: expect.any(String),
        });
      },
    },
  },
  {
    name: 'without testing or storybook',
    appName: 'lib-minimal',
    prompts: {
      projectType: 'library',
      githubOrg: 'demo-inc',
      features: [],
    },
    options: {},
    expectations: {
      files: ['package.json', 'tsconfig.json', 'README.md', 'src/index.ts'],
      absentFiles: [
        'jest.config.js',
        'src/__tests__/simple.test.ts',
        '.storybook/main.js',
        'src/index.stories.tsx',
        '.circleci/config.yml',
        '.github/workflows/bundle_size.yml',
      ],
      packageChecks(pkg, scenario) {
        expect(pkg.name).toBe(scenario.appName);
        expect(Object.keys(pkg.peerDependencies ?? {})).toHaveLength(0);
        expect(pkg.devDependencies ?? {}).not.toHaveProperty(
          '@anansi/jest-preset',
        );
        expect(pkg.devDependencies ?? {}).not.toHaveProperty('storybook');
      },
    },
  },
];

function runScenarioTests(scenarios) {
  describe.each(scenarios.map(scenario => [scenario.name, scenario]))(
    '%s',
    (_scenarioName, scenario) => {
      let result;

      beforeAll(async () => {
        result = await runAppGenerator({
          appName: scenario.appName,
          prompts: {
            githubOrg: 'demo-inc',
            ...scenario.prompts,
          },
          options: scenario.options,
        });
      });

      afterAll(async () => {
        if (result?.cleanup) {
          await result.cleanup();
        }
      });

      it('generates the expected file structure', () => {
        withinDirectory(result.cwd, () => {
          if (scenario.expectations.files?.length) {
            assert.file(scenario.expectations.files);
          }
          // Claude Code reads AGENTS.md itself; a CLAUDE.md would shadow it
          assert.noFile([
            ...(scenario.expectations.absentFiles ?? []),
            'CLAUDE.md',
          ]);
        });
      });

      it('formats generated sources with the project prettier config', async () => {
        const { check } = await import('prettier');
        const pkg = JSON.parse(
          fs.readFileSync(path.join(result.cwd, 'package.json'), 'utf8'),
        );
        for (const file of ['package.json', 'tsconfig.json']) {
          const filepath = path.join(result.cwd, file);
          await expect(
            check(fs.readFileSync(filepath, 'utf8'), {
              ...pkg.prettier,
              filepath,
            }),
          ).resolves.toBe(true);
        }
      });

      it('applies the correct package configuration', () => {
        if (!scenario.expectations.packageChecks) return;
        const pkg = JSON.parse(
          fs.readFileSync(path.join(result.cwd, 'package.json'), 'utf8'),
        );
        scenario.expectations.packageChecks(pkg, scenario);
      });

      if (scenario.expectations.extraChecks) {
        it('passes scenario-specific validations', () => {
          scenario.expectations.extraChecks(result.cwd);
        });
      }
    },
  );
}

describe('App generator', () => {
  describe('SPA project scenarios', () => {
    runScenarioTests(SPA_SCENARIOS);
  });

  describe('Library project scenarios', () => {
    runScenarioTests(LIBRARY_SCENARIOS);
  });
});

describe('License generator', () => {
  const LICENSE_ENTRY = path.resolve(PACKAGE_ROOT, 'generators/license');

  async function readLicense(options, gitUser = {}) {
    const helpers = await getYeomanTest();
    const result = await helpers
      .run(LICENSE_ENTRY)
      .withOptions(options)
      .withPrompts({ license: 'MIT' })
      .onGenerator(generator => {
        // Stub git so the machine's own identity can't leak in; `git` is a
        // getter-only accessor, so shadow it rather than assign
        Object.defineProperty(generator, 'git', {
          value: {
            name: async () => gitUser.name,
            email: async () => gitUser.email,
          },
        });
      });
    try {
      return fs.readFileSync(path.join(result.cwd, 'LICENSE'), 'utf8');
    } finally {
      result.cleanup();
    }
  }

  it('writes the author from name, email and website', async () => {
    const license = await readLicense({
      name: 'Ada',
      email: 'ada@example.com',
      website: 'https://ada.dev',
    });
    expect(license).toContain('Ada <ada@example.com> (https://ada.dev)');
  });

  it('falls back to the git identity', async () => {
    const license = await readLicense(
      {},
      { name: 'Grace', email: 'grace@example.com' },
    );
    expect(license).toContain('Grace <grace@example.com>');
  });

  it('omits the holder when git has no identity configured', async () => {
    const license = await readLicense({});
    expect(license).toMatch(/^Copyright \(c\) \d+ *$/m);
  });
});
