const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const webpack = require('webpack');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rm = promisify(fs.rm);

const REACT_FAST_REFRESH_LOG = 'React fast refresh detected and enabled';

function captureConsole() {
  const infoMessages = [];
  const warnMessages = [];
  const infoSpy = jest.spyOn(console, 'info').mockImplementation(message => {
    infoMessages.push(message);
  });
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(message => {
    warnMessages.push(message);
  });
  return {
    infoMessages,
    warnMessages,
    restore: () => {
      infoSpy.mockRestore();
      warnSpy.mockRestore();
    },
  };
}

// All tests run from src/__tests__
// From src/__tests__/integration, we need to go up to src/__fixtures__
const FIXTURES_DIR = path.join(__dirname, '../../__fixtures__');
// Package root is 3 levels up from __tests__/integration
const PACKAGE_ROOT = path.resolve(__dirname, '../../../');
const TIMEOUT = 60000; // 60 seconds for builds

// Cache directories that persist between runs
const WEBPACK_CACHE_DIR = path.join(
  PACKAGE_ROOT,
  'node_modules',
  '.cache',
  'webpack',
);
const BABEL_CACHE_DIR = path.join(
  PACKAGE_ROOT,
  'node_modules',
  '.cache',
  'babel-loader',
);

async function clearCache(cacheDir) {
  try {
    await stat(cacheDir);
    await rm(cacheDir, { recursive: true, force: true });
  } catch (e) {
    // Cache directory doesn't exist yet, which is fine
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}

async function clearAllCaches() {
  await Promise.all([
    clearCache(WEBPACK_CACHE_DIR),
    clearCache(BABEL_CACHE_DIR),
  ]);
}

async function runWebpack(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (stats.hasErrors()) {
        return reject(
          new Error(
            stats
              .toString({
                errors: true,
                warnings: false,
              })
              .split('\n')
              .slice(0, 20)
              .join('\n'),
          ),
        );
      }
      resolve(stats);
    });
  });
}

// eslint-disable-next-line no-unused-vars
async function getFixtures() {
  const entries = await readdir(FIXTURES_DIR);
  const fixtures = [];

  for (const entry of entries) {
    const fixturePath = path.join(FIXTURES_DIR, entry);
    const info = await stat(fixturePath);
    if (info.isDirectory()) {
      const webpackConfigPath = path.join(fixturePath, 'webpack.config.js');
      try {
        await stat(webpackConfigPath);
        fixtures.push(entry);
      } catch {
        // No webpack.config.js, skip this fixture
      }
    }
  }

  return fixtures;
}

// Integration tests skipped - need proper fixture setup with webpack dependencies
// These tests would verify real webpack builds work correctly
describe('Integration tests with fixtures', () => {
  // Clear webpack and babel caches at the start of the test suite
  // This ensures tests start from a clean state while still allowing
  // cache benefits during the test run
  beforeAll(async () => {
    await clearAllCaches();
  }, TIMEOUT);

  const fixtures = [
    'webpack-basic',
    'webpack-react',
    'ts',
    'css-modules',
    'linaria',
  ];

  fixtures.forEach(fixtureName => {
    describe(`fixture: ${fixtureName}`, () => {
      const fixturePath = path.join(FIXTURES_DIR, fixtureName);

      it(
        'should build successfully in production mode',
        async () => {
          const consoleCapture = captureConsole();
          try {
            const webpackConfigPath = path.join(
              fixturePath,
              'webpack.config.js',
            );
            // Use require.resolve to find the webpack config relative to src
            const resolvedPath = require.resolve(webpackConfigPath);
            const webpackConfig = require(resolvedPath);

            // Override output path to a test-specific location
            const testOutputPath = path.join(
              fixturePath,
              'test-dist-production',
            );
            const config = webpackConfig(
              {},
              { mode: 'production', target: 'web' },
            );
            config.output.path = testOutputPath;
            // Ensure chunkFormat is set for webpack 5
            if (!config.output.chunkFormat) {
              config.output.chunkFormat = 'array-push';
            }

            const stats = await runWebpack(config);

            expect(stats).toBeDefined();
            expect(stats.hasErrors()).toBe(false);

            // Check that output directory exists
            const outputExists = await stat(testOutputPath)
              .then(() => true)
              .catch(() => false);
            expect(outputExists).toBe(true);

            // Check for main bundle files
            const files = await readdir(testOutputPath);
            expect(files.length).toBeGreaterThan(0);

            // Check for entry point (might be hashed)
            const hasEntry = files.some(file => {
              // Entry could be App.js, main.js, or similar depending on config
              return /\.js$/.test(file) && !file.includes('.chunk');
            });
            expect(hasEntry).toBe(true);

            // Cleanup
            fs.rmSync(testOutputPath, { recursive: true, force: true });

            expect(
              consoleCapture.infoMessages.some(
                message =>
                  typeof message === 'string' &&
                  message.includes(REACT_FAST_REFRESH_LOG),
              ),
            ).toBe(false);
          } finally {
            consoleCapture.restore();
          }
        },
        TIMEOUT,
      );

      it(
        'should build successfully in development mode',
        async () => {
          const consoleCapture = captureConsole();
          try {
            const webpackConfigPath = path.join(
              fixturePath,
              'webpack.config.js',
            );
            const resolvedPath = require.resolve(webpackConfigPath);
            const webpackConfig = require(resolvedPath);

            const testOutputPath = path.join(
              fixturePath,
              'test-dist-development',
            );
            const config = webpackConfig(
              {},
              { mode: 'development', target: 'web' },
            );
            config.output.path = testOutputPath;
            // Ensure chunkFormat is set for webpack 5
            if (!config.output.chunkFormat) {
              config.output.chunkFormat = 'array-push';
            }

            const stats = await runWebpack(config);

            expect(stats).toBeDefined();
            expect(stats.hasErrors()).toBe(false);

            // Check that output directory exists
            const outputExists = await stat(testOutputPath)
              .then(() => true)
              .catch(() => false);
            expect(outputExists).toBe(true);

            // Cleanup
            fs.rmSync(testOutputPath, { recursive: true, force: true });

            expect(
              consoleCapture.infoMessages.some(
                message =>
                  typeof message === 'string' &&
                  message.includes(REACT_FAST_REFRESH_LOG),
              ),
            ).toBe(true);
          } finally {
            consoleCapture.restore();
          }
        },
        TIMEOUT,
      );

      it('should not produce unexpected warnings', async () => {
        const webpackConfigPath = path.join(fixturePath, 'webpack.config.js');
        const resolvedPath = require.resolve(webpackConfigPath);
        const webpackConfig = require(resolvedPath);

        const testOutputPath = path.join(fixturePath, 'test-dist-warnings');
        const config = webpackConfig({}, { mode: 'production', target: 'web' });
        config.output.path = testOutputPath;
        // Ensure chunkFormat is set for webpack 5
        if (!config.output.chunkFormat) {
          config.output.chunkFormat = 'array-push';
        }

        const stats = await runWebpack(config);

        // Check for unexpected warnings
        // Some warnings are acceptable (like bundle size warnings)
        const warnings = stats.toString({ warnings: true });
        const unexpectedWarnings = warnings
          .split('\n')
          .filter(
            line =>
              line.includes('Failed to parse source map') ||
              line.includes('Module not found'),
          );

        expect(unexpectedWarnings.length).toBe(0);

        // Cleanup
        fs.rmSync(testOutputPath, { recursive: true, force: true });
      });
    });
  });
});
