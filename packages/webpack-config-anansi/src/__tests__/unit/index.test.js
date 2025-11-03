const path = require('path');

const { makeConfig } = require('../../index');

describe('makeConfig', () => {
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
});
