const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// All tests run from src/__tests__
const FIXTURES_DIR = path.join(__dirname, '../__fixtures__');
const TIMEOUT = 60000; // 60 seconds for builds

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
      } catch (e) {
        // No webpack.config.js, skip this fixture
      }
    }
  }

  return fixtures;
}

describe('Integration tests with fixtures', () => {
  const fixtures = ['webpack-basic', 'webpack-react', 'ts', 'css-modules'];

  fixtures.forEach(fixtureName => {
    describe(`fixture: ${fixtureName}`, () => {
      const fixturePath = path.join(FIXTURES_DIR, fixtureName);

      it(
        'should build successfully in production mode',
        async () => {
          const webpackConfigPath = path.join(fixturePath, 'webpack.config.js');
          // Use require.resolve to find the webpack config relative to src
          const resolvedPath = require.resolve(webpackConfigPath);
          const webpackConfig = require(resolvedPath);

          // Override output path to a test-specific location
          const testOutputPath = path.join(fixturePath, 'test-dist-production');
          const config = webpackConfig({}, { mode: 'production' });
          config.output.path = testOutputPath;

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
        },
        TIMEOUT,
      );

      it(
        'should build successfully in development mode',
        async () => {
          const webpackConfigPath = path.join(fixturePath, 'webpack.config.js');
          const resolvedPath = require.resolve(webpackConfigPath);
          const webpackConfig = require(resolvedPath);

          const testOutputPath = path.join(
            fixturePath,
            'test-dist-development',
          );
          const config = webpackConfig({}, { mode: 'development' });
          config.output.path = testOutputPath;

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
        },
        TIMEOUT,
      );

      it('should not produce unexpected warnings', async () => {
        const webpackConfigPath = path.join(fixturePath, 'webpack.config.js');
        const resolvedPath = require.resolve(webpackConfigPath);
        const webpackConfig = require(resolvedPath);

        const testOutputPath = path.join(fixturePath, 'test-dist-warnings');
        const config = webpackConfig({}, { mode: 'production' });
        config.output.path = testOutputPath;

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

