const path = require('path');

const { makeConfig } = require('../../index');

describe('makeConfig', () => {
  const reactFastRefreshLog = 'React fast refresh detected and enabled';
  let consoleInfoSpy;

  beforeAll(() => {
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleInfoSpy.mockRestore();
  });

  beforeEach(() => {
    consoleInfoSpy.mockClear();
  });
  const testRoot = path.join(__dirname, '../../..');

  // Default options that disable tsconfigPaths to avoid requiring tsconfig.json in tests
  const defaultTestOptions = { tsconfigPathsOptions: false };

  it('should create a config function', () => {
    const configFn = makeConfig(defaultTestOptions);
    expect(typeof configFn).toBe('function');
  });

  describe('basic configuration', () => {
    it('should have correct defaults', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      expect(config.context).toBe(testRoot);
      expect(config.entry).toBeDefined();
      expect(config.output).toBeDefined();
      expect(config.output.path).toContain('generated_assets');
    });

    it('should use custom rootPath and basePath', () => {
      // Use a real path that exists to avoid React resolution issues
      const configFn = makeConfig({
        ...defaultTestOptions,
        rootPath: testRoot,
        basePath: 'source',
      });
      const config = configFn({}, { mode: 'development' });

      expect(config.context).toBe(testRoot);
      // entry might be an array, check that it includes the basePath
      const entryArray =
        Array.isArray(config.entry.App) ? config.entry.App : [config.entry.App];
      expect(
        entryArray.some(entry => entry && entry.includes('./source')),
      ).toBe(true);
    });

    it('should use custom buildDir and manifestFilename', () => {
      const configFn = makeConfig({
        ...defaultTestOptions,
        buildDir: 'dist',
        manifestFilename: 'assets.json',
      });
      const config = configFn({}, { mode: 'development' });

      expect(config.output.path).toContain('dist');

      // Find StatsWriterPlugin by checking its options
      const statsPlugin = config.plugins.find(
        plugin => plugin.opts && plugin.opts.filename === 'assets.json',
      );
      expect(statsPlugin).toBeDefined();
      expect(statsPlugin.opts.filename).toBe('assets.json');
    });
  });

  describe('development mode', () => {
    it('should set mode to development', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      expect(config.mode).toBe('development');
      expect(config.devtool).toBe('cheap-module-source-map');
    });

    it('should have devServer configuration', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      expect(config.devServer).toBeDefined();
      // hot can be 'only' when react-refresh is enabled
      expect(config.devServer.hot).toBeTruthy();
      expect(config.devServer.compress).toBe(true);
    });

    it('logs react fast refresh enablement in web builds', () => {
      const configFn = makeConfig(defaultTestOptions);
      configFn({}, { mode: 'development', target: 'web' });

      expect(
        consoleInfoSpy.mock.calls.some(
          ([message]) =>
            typeof message === 'string' &&
            message.includes(reactFastRefreshLog),
        ),
      ).toBe(true);
    });

    it('should include devServer when not targeting node', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development', target: 'web' });

      expect(config.devServer).toBeDefined();
    });

    it('should not include devServer plugins when targeting node', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development', target: 'node' });

      // Should not have HtmlWebpackPlugin in devServer mode for node
      const hasHtmlPlugin = config.plugins.some(
        plugin => plugin.constructor.name === 'HtmlWebpackPlugin',
      );
      expect(hasHtmlPlugin).toBe(false);
    });

    it('does not log react fast refresh when targeting node', () => {
      const configFn = makeConfig(defaultTestOptions);
      configFn({}, { mode: 'development', target: 'node' });

      expect(
        consoleInfoSpy.mock.calls.some(
          ([message]) =>
            typeof message === 'string' &&
            message.includes(reactFastRefreshLog),
        ),
      ).toBe(false);
    });
  });

  describe('production mode', () => {
    it('should set mode to production', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'production' });

      expect(config.mode).toBe('production');
      expect(config.bail).toBe(true);
    });

    it('should include optimization settings', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'production' });

      expect(config.optimization).toBeDefined();
      expect(config.optimization.splitChunks).toBeDefined();
      expect(config.optimization.minimizer).toBeDefined();
      expect(config.optimization.minimizer.length).toBeGreaterThan(0);
    });

    it('should include CleanWebpackPlugin', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'production' });

      const hasCleanPlugin = config.plugins.some(
        plugin => plugin.constructor.name === 'CleanWebpackPlugin',
      );
      expect(hasCleanPlugin).toBe(true);
    });

    it('should include Minimize plugins', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'production' });

      expect(config.optimization.minimizer).toBeDefined();
      expect(config.optimization.minimizer.length).toBeGreaterThan(0);
    });
  });

  describe('resolve configuration', () => {
    it('should have correct extensions', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      expect(config.resolve.extensions).toEqual(
        expect.arrayContaining(['.ts', '.tsx', '.mts', '.cts', '...']),
      );
    });

    it('should have extension aliases', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      expect(config.resolve.extensionAlias).toEqual({
        '.js': ['.js', '.ts', '.tsx', '.jsx'],
        '.mjs': ['.mjs', '.mts'],
        '.cjs': ['.cjs', '.cts'],
      });
    });

    it('should include node polyfills in fallback', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      expect(config.resolve.fallback).toBeDefined();
      expect(config.resolve.fallback.buffer).toBeDefined();
    });

    it('should disable tsconfigPaths when set to false', () => {
      const configFn = makeConfig({
        tsconfigPathsOptions: false,
      });
      const config = configFn({}, { mode: 'development' });

      expect(config.resolve.plugins).toEqual([]);
    });
  });

  describe('module rules', () => {
    it('should have babel loader for TS/JS files', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      const tsRule = config.module.rules.find(
        rule => rule.test && rule.test.toString().includes('(t|j)sx'),
      );
      expect(tsRule).toBeDefined();
      expect(tsRule.use || tsRule.oneOf).toBeDefined();
    });

    it('should have svg loader with SVGR for JS/TS files', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      const svgRule = config.module.rules.find(
        rule => rule.test && rule.test.toString().includes('svg'),
      );
      expect(svgRule).toBeDefined();
      expect(svgRule.oneOf).toBeDefined();
    });

    it('should have asset loaders for images', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      const imageRule = config.module.rules.find(
        rule =>
          rule.test && rule.test.toString().match(/png|jpg|gif|webp|avif/),
      );
      expect(imageRule).toBeDefined();
      expect(imageRule.type).toBe('asset');
    });

    it('should have worker loader', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      const workerRule = config.module.rules.find(
        rule =>
          rule.oneOf &&
          rule.oneOf.some(
            subRule =>
              subRule.test && subRule.test.toString().includes('worker'),
          ),
      );
      expect(workerRule).toBeDefined();
    });
  });

  describe('environment plugins', () => {
    it('should add EnvironmentPlugin for web target', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development', target: 'web' });

      const hasEnvPlugin = config.plugins.some(
        plugin => plugin.constructor.name === 'EnvironmentPlugin',
      );
      expect(hasEnvPlugin).toBe(true);
    });

    it('should add ProvidePlugin for Buffer and process in web target', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development', target: 'web' });

      const hasProvidePlugin = config.plugins.some(
        plugin => plugin.constructor.name === 'ProvidePlugin',
      );
      expect(hasProvidePlugin).toBe(true);
    });
  });

  describe('library mode', () => {
    it('should configure library output when library option provided', () => {
      const configFn = makeConfig({
        ...defaultTestOptions,
        library: {
          type: 'umd',
          name: 'MyLib',
        },
      });
      const config = configFn({}, { mode: 'production' });

      expect(config.output.library).toBeDefined();
    });
  });

  describe('analyze mode', () => {
    it('should add BundleAnalyzerPlugin when analyze env is set', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({ analyze: true }, { mode: 'production' });

      const hasAnalyzerPlugin = config.plugins.some(
        plugin => plugin.constructor.name === 'BundleAnalyzerPlugin',
      );
      expect(hasAnalyzerPlugin).toBe(true);
    });

    it('should remove globalObject when analyze is enabled', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({ analyze: true }, { mode: 'production' });

      expect(config.output.globalObject).toBeUndefined();
    });
  });

  describe('nohash option', () => {
    it('should disable hashing in filenames when nohash is true', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({ nohash: true }, { mode: 'production' });

      expect(config.output.filename).toBe('[name].js');
      expect(config.output.chunkFilename).toBe('[name].chunk.js');
      expect(config.output.assetModuleFilename).toContain('[name]');
    });
  });

  describe('cache configuration', () => {
    it('should use filesystem cache by default', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      expect(config.cache).toBeDefined();
      expect(config.cache.type).toBe('filesystem');
    });

    it('should disable cache when WEBPACK_NO_CACHE is set', () => {
      const originalEnv = process.env.WEBPACK_NO_CACHE;
      process.env.WEBPACK_NO_CACHE = 'true';

      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      expect(config.cache).toBeUndefined();

      process.env.WEBPACK_NO_CACHE = originalEnv;
    });
  });

  describe('option validation', () => {
    it('should throw error for undefined sassOptions', () => {
      expect(() => {
        const configFn = makeConfig({ sassOptions: undefined });
        configFn({}, { mode: 'development' });
      }).toThrow();
    });

    it('should throw error for undefined htmlOptions', () => {
      expect(() => {
        const configFn = makeConfig({ htmlOptions: undefined });
        configFn({}, { mode: 'development' });
      }).toThrow();
    });

    it('should throw error for undefined svgoOptions', () => {
      expect(() => {
        const configFn = makeConfig({ svgoOptions: undefined });
        configFn({}, { mode: 'development' });
      }).toThrow();
    });

    it('should throw error for undefined svgrOptions', () => {
      expect(() => {
        const configFn = makeConfig({ svgrOptions: undefined });
        configFn({}, { mode: 'development' });
      }).toThrow();
    });

    it('should throw error for undefined inJSOptions', () => {
      expect(() => {
        const configFn = makeConfig({ inJSOptions: undefined });
        configFn({}, { mode: 'development' });
      }).toThrow();
    });
  });

  describe('SVGO v4 compatibility', () => {
    it('should configure SVGO options with correct defaults', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'production' });

      // Verify svgoOptions are set
      expect(config.module.rules).toBeDefined();

      // Find the svgo-loader rule in production mode
      const svgoRule = config.module.rules.find(
        rule =>
          rule.use &&
          rule.use.some(
            loader => loader.loader && loader.loader.includes('svgo-loader'),
          ),
      );

      if (svgoRule) {
        expect(svgoRule.use[0].options).toBeDefined();
        const svgoOptions = svgoRule.use[0].options;

        // Verify preset-default is configured
        expect(svgoOptions.plugins).toBeDefined();
        const presetPlugin = svgoOptions.plugins.find(
          p =>
            (typeof p === 'object' && p.name === 'preset-default') ||
            (typeof p === 'string' && p === 'preset-default'),
        );
        expect(presetPlugin).toBeDefined();

        // Verify overrides are set correctly for v4 compatibility
        // Note: In SVGO v4, removeTitle and removeViewBox are no longer part of preset-default
        // and are disabled by default, so they're not in the overrides
        if (typeof presetPlugin === 'object' && presetPlugin.params) {
          expect(presetPlugin.params.overrides).toBeDefined();
          // convertShapeToPath should still be in overrides
          expect(presetPlugin.params.overrides.convertShapeToPath).toBe(false);
          // removeTitle and removeViewBox are not in overrides (they're disabled by default in v4)
          expect(presetPlugin.params.overrides.removeTitle).toBeUndefined();
          expect(presetPlugin.params.overrides.removeViewBox).toBeUndefined();
        }
      }
    });

    it('should preserve viewBox and title attributes (SVGO v4 default behavior)', async () => {
      // This test validates that SVGO v4 works correctly with our configuration
      // by actually optimizing an SVG and verifying viewBox and title are preserved
      const { optimize } = require('svgo');
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'production' });

      // Get the SVGO options from the config
      const svgoRule = config.module.rules.find(
        rule =>
          rule.use &&
          rule.use.some(
            loader => loader.loader && loader.loader.includes('svgo-loader'),
          ),
      );

      if (!svgoRule) {
        // SVGO loader might not be present if svgoOptions is false
        return;
      }

      const svgoOptions = svgoRule.use[0].options;

      // Test SVG with viewBox and title
      const testSvg = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <title>Test SVG</title>
          <circle cx="50" cy="50" r="40" fill="red"/>
        </svg>
      `;

      const result = optimize(testSvg, svgoOptions);

      // Verify optimization succeeded
      expect(result.data).toBeDefined();
      expect(result.data).toContain('viewBox');
      expect(result.data).toContain('title');

      // Verify the SVG is still valid
      expect(result.data).toContain('<svg');
      expect(result.data).toContain('circle');
    });

    it('should allow custom SVGO options to override defaults', () => {
      const customSvgoOptions = {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeTitle: true, // Override default
                removeViewBox: false,
              },
            },
          },
        ],
      };

      const configFn = makeConfig({
        ...defaultTestOptions,
        svgoOptions: customSvgoOptions,
      });
      const config = configFn({}, { mode: 'production' });

      const svgoRule = config.module.rules.find(
        rule =>
          rule.use &&
          rule.use.some(
            loader => loader.loader && loader.loader.includes('svgo-loader'),
          ),
      );

      if (svgoRule) {
        const svgoOptions = svgoRule.use[0].options;
        const presetPlugin = svgoOptions.plugins.find(
          p => typeof p === 'object' && p.name === 'preset-default',
        );

        expect(presetPlugin).toBeDefined();
        expect(presetPlugin.params.overrides.removeTitle).toBe(true);
        expect(presetPlugin.params.overrides.removeViewBox).toBe(false);
      }
    });

    it('should configure SVGR with SVGO options for JS/TS imports', () => {
      const configFn = makeConfig(defaultTestOptions);
      const config = configFn({}, { mode: 'development' });

      const svgRule = config.module.rules.find(
        rule => rule.test && rule.test.toString().includes('svg'),
      );

      expect(svgRule).toBeDefined();
      expect(svgRule.oneOf).toBeDefined();

      // Find the SVGR loader rule
      const svgrRule = svgRule.oneOf.find(
        rule => rule.issuer && rule.issuer.toString().includes('(j|t)sx'),
      );

      expect(svgrRule).toBeDefined();
      expect(svgrRule.use).toBeDefined();

      const svgrLoader = svgrRule.use.find(
        loader => loader.loader && loader.loader.includes('@svgr/webpack'),
      );

      expect(svgrLoader).toBeDefined();
      expect(svgrLoader.options).toBeDefined();
      expect(svgrLoader.options.svgoConfig).toBeDefined();
    });
  });
});
