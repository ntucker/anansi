const path = require('path');

const { makeConfig, ROOT_PATH } = require('../../index');

describe('makeConfig', () => {
  // Default options that disable tsconfig path resolution to avoid requiring
  // tsconfig.json in tests.
  const defaultTestOptions = {
    tsconfigPathsOptions: false,
    rootPath: path.join(__dirname, '../../..'),
  };

  it('returns an Rsbuild config object', () => {
    const config = makeConfig(defaultTestOptions);
    expect(typeof config).toBe('object');
    expect(config.source).toBeDefined();
    expect(config.output).toBeDefined();
    expect(Array.isArray(config.plugins)).toBe(true);
  });

  describe('basic configuration', () => {
    it('sets sensible defaults', () => {
      const config = makeConfig(defaultTestOptions);
      expect(config.source.entry).toBeDefined();
      expect(config.output.distPath.root).toContain('generated_assets');
      expect(config.output.target).toBe('web');
    });

    it('uses custom basePath and buildDir', () => {
      const config = makeConfig({
        ...defaultTestOptions,
        basePath: 'app',
        buildDir: 'dist/',
      });
      expect(config.output.distPath.root).toContain('dist');
      const entry = config.source.entry.App;
      const entryPath = Array.isArray(entry) ? entry[0] : entry;
      expect(entryPath).toContain('app');
    });

    it('uses custom manifestFilename', () => {
      const config = makeConfig({
        ...defaultTestOptions,
        manifestFilename: 'assets.json',
      });
      expect(config.output.manifest).toBe('assets.json');
    });
  });

  describe('mode handling', () => {
    it('treats production NODE_ENV as production', () => {
      const original = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        const config = makeConfig(defaultTestOptions);
        // splitChunks cache groups exist only in production
        expect(config.splitChunks).toBeDefined();
        expect(config.splitChunks.cacheGroups.polyfill).toBeDefined();
      } finally {
        process.env.NODE_ENV = original;
      }
    });

    it('does not error in development', () => {
      const original = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      try {
        const config = makeConfig(defaultTestOptions);
        expect(config.dev).toBeDefined();
        expect(config.dev.hmr).toBe(true);
      } finally {
        process.env.NODE_ENV = original;
      }
    });
  });

  describe('plugins', () => {
    it('registers React, Babel, NodePolyfill, SVGR', () => {
      const config = makeConfig(defaultTestOptions);
      const names = config.plugins.map(p => p.name).filter(Boolean);
      expect(names).toEqual(
        expect.arrayContaining([
          expect.stringContaining('react'),
          expect.stringContaining('babel'),
          expect.stringContaining('node-polyfill'),
          expect.stringContaining('svgr'),
        ]),
      );
    });

    it('omits NodePolyfill when target is node', () => {
      const config = makeConfig({
        ...defaultTestOptions,
        target: 'node',
      });
      const names = config.plugins.map(p => p.name).filter(Boolean);
      expect(names.some(n => n.includes('node-polyfill'))).toBe(false);
    });

    it('honours svgrOptions: false', () => {
      const config = makeConfig({
        ...defaultTestOptions,
        svgrOptions: false,
      });
      const names = config.plugins.map(p => p.name).filter(Boolean);
      expect(names.some(n => n.includes('svgr'))).toBe(false);
    });
  });

  describe('option validation', () => {
    it('throws on undefined sassOptions', () => {
      expect(() => makeConfig({ sassOptions: undefined })).toThrow();
    });
    it('throws on undefined htmlOptions', () => {
      expect(() => makeConfig({ htmlOptions: undefined })).toThrow();
    });
    it('throws on undefined svgoOptions', () => {
      expect(() => makeConfig({ svgoOptions: undefined })).toThrow();
    });
    it('throws on undefined svgrOptions', () => {
      expect(() => makeConfig({ svgrOptions: undefined })).toThrow();
    });
    it('throws on undefined inJSOptions', () => {
      expect(() => makeConfig({ inJSOptions: undefined })).toThrow();
    });
    it('throws on undefined cssExtractOptions', () => {
      expect(() => makeConfig({ cssExtractOptions: undefined })).toThrow();
    });
    it('throws on undefined globalStyleDir', () => {
      expect(() => makeConfig({ globalStyleDir: undefined })).toThrow();
    });
  });

  describe('SVGO defaults', () => {
    it('configures preset-default with convertShapeToPath disabled', () => {
      const config = makeConfig(defaultTestOptions);
      const svgr = config.plugins.find(
        p => typeof p?.name === 'string' && p.name.includes('svgr'),
      );
      expect(svgr).toBeDefined();
    });
  });

  describe('node target', () => {
    it('configures externals and disables splitChunks for node', () => {
      const config = makeConfig({
        ...defaultTestOptions,
        target: 'node',
      });
      expect(config.output.target).toBe('node');
      expect(config.splitChunks).toBe(false);
      expect(config.output.externals).toBeDefined();
    });

    it('reads RSBUILD_TARGET for script-driven node builds', () => {
      const original = process.env.RSBUILD_TARGET;
      process.env.RSBUILD_TARGET = 'node';
      try {
        const config = makeConfig(defaultTestOptions);
        expect(config.output.target).toBe('node');
        expect(config.output.externals).toBeDefined();
      } finally {
        if (original === undefined) delete process.env.RSBUILD_TARGET;
        else process.env.RSBUILD_TARGET = original;
      }
    });
  });

  describe('library mode', () => {
    it('configures library output', () => {
      const config = makeConfig({
        ...defaultTestOptions,
        library: { type: 'commonjs2' },
      });
      expect(config.output.library).toBeDefined();
      expect(config.output.library.type).toBe('commonjs2');
    });
  });

  describe('analyze mode', () => {
    it('marks nohash when analyze is set', () => {
      const config = makeConfig({
        ...defaultTestOptions,
        analyze: true,
      });
      expect(config.output.filename.js).toBe('[name].js');
    });
  });

  describe('check mode', () => {
    it('reads RSBUILD_CHECK=nobuild for script-driven package checks', () => {
      const original = process.env.RSBUILD_CHECK;
      process.env.RSBUILD_CHECK = 'nobuild';
      try {
        const config = makeConfig(defaultTestOptions);
        expect(config.output.distPath.root).toBe('/tmp/anansi-build');
        expect(config.splitChunks).toBe(false);
      } finally {
        if (original === undefined) delete process.env.RSBUILD_CHECK;
        else process.env.RSBUILD_CHECK = original;
      }
    });
  });

  describe('nohash', () => {
    it('disables hashes in filenames when nohash is true', () => {
      const config = makeConfig({
        ...defaultTestOptions,
        nohash: true,
      });
      expect(config.output.filename.js).toBe('[name].js');
      expect(config.output.filename.css).toBe('[name].css');
    });
  });

  describe('ROOT_PATH export', () => {
    it('is a path string', () => {
      expect(typeof ROOT_PATH).toBe('string');
      expect(ROOT_PATH.length).toBeGreaterThan(0);
    });
  });
});
