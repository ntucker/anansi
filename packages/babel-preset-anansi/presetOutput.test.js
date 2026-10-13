const fs = require('fs');
const os = require('os');
const path = require('path');

const buildPreset = require('./index');

describe('buildPreset', () => {
  let api;

  beforeEach(() => {
    api = {
      assertVersion: jest.fn(),
      env: jest.fn(),
      caller: jest.fn(),
      targets: jest.fn(),
    };
  });

  it('should assert supported Babel versions', () => {
    buildPreset(api);
    expect(api.assertVersion).toHaveBeenCalledWith('^7.12.0 || ^8.0.0-0');
  });

  it('should set default options', () => {
    api.env.mockReturnValue('development');
    const preset = buildPreset(api);
    expect(preset.presets).toBeDefined();
    expect(preset.plugins).toBeDefined();
  });

  it('should enable curated assumptions when loose is true', () => {
    api.env.mockReturnValue('development');
    const preset = buildPreset(api, { loose: true });
    expect(preset.assumptions).toEqual({
      mutableTemplateObject: true,
      noClassCalls: true,
      noDocumentAll: true,
      objectRestNoSymbols: true,
      privateFieldsAsProperties: true,
      pureGetters: true,
      setClassMethods: true,
      setComputedProperties: true,
      setPublicClassFields: true,
      setSpreadProperties: true,
    });
  });

  it('should configure preset for production environment', () => {
    api.env.mockReturnValue('production');
    const preset = buildPreset(api);
    expect(preset.presets).toBeDefined();
    expect(preset.plugins).toBeDefined();
  });

  it('should configure preset for development environment', () => {
    api.env.mockReturnValue('development');
    const preset = buildPreset(api);
    expect(preset.presets).toBeDefined();
    expect(preset.plugins).toBeDefined();
  });

  it('should configure preset for test environment', () => {
    api.env.mockReturnValue('test');
    const preset = buildPreset(api);
    expect(preset.presets).toBeDefined();
    expect(preset.plugins).toBeDefined();
  });

  it('should handle TypeScript configuration', () => {
    api.env.mockReturnValue('development');
    const preset = buildPreset(api, {
      tsConfigPath: path.resolve(__dirname, 'tsconfig.json'),
    });
    expect(preset.overrides).toBeDefined();
  });

  it('should handle decorators configuration', () => {
    api.env.mockReturnValue('development');
    const preset = buildPreset(api, {
      decoratorsOptions: { version: 'legacy' },
    });
    expect(preset.overrides[0].plugins).toContainEqual([
      require('@babel/plugin-proposal-decorators').default,
      { version: 'legacy' },
    ]);
  });

  it('should reject the removed minify option', () => {
    api.env.mockReturnValue('production');
    expect(() => buildPreset(api, { minify: true })).toThrow(/minify/);
  });

  // builds the preset with cwd set to a temp project made of `files`
  function buildInProject(files) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'anansi-preset-'));
    for (const [file, json] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
      fs.writeFileSync(path.join(dir, file), JSON.stringify(json));
    }
    const cwd = jest.spyOn(process, 'cwd').mockReturnValue(dir);
    try {
      return buildPreset(api);
    } finally {
      cwd.mockRestore();
      fs.rmSync(dir, { recursive: true });
    }
  }

  it('should remove prop-types only from js files in production', () => {
    const removePropTypes =
      require('babel-plugin-transform-react-remove-prop-types').default;
    api.env.mockReturnValue('production');
    const [ts, js] = buildPreset(api).overrides;
    expect(js.plugins).toContain(removePropTypes);
    expect(ts.plugins).not.toContain(removePropTypes);
    api.env.mockReturnValue('development');
    expect(buildPreset(api).overrides[1].plugins).not.toContain(
      removePropTypes,
    );
  });

  it.each([
    [{ hasJsxRuntime: false }, {}, 'classic'],
    [{}, { hasJsxRuntime: false }, 'classic'],
    [{ hasJsxRuntime: true }, { hasJsxRuntime: false }, 'classic'],
    [{ hasJsxRuntime: false }, { hasJsxRuntime: true }, 'automatic'],
    [{}, {}, 'automatic'],
  ])('caller %j with options %j => %s runtime', (caller, options, runtime) => {
    api.env.mockReturnValue('development');
    api.caller.mockImplementation(cb => cb(caller));
    const reactOverride = buildPreset(api, options).overrides.find(
      o => o.presets,
    );
    expect(reactOverride.presets[0][1].runtime).toBe(runtime);
  });

  it.each([
    [{ developmentSourceSelf: true }, {}, true],
    [{ developmentSourceSelf: false }, {}, false],
    [{ developmentSourceSelf: true }, { developmentSourceSelf: false }, false],
  ])(
    'caller %j with options %j => developmentSourceSelf %s',
    (caller, options, expected) => {
      api.env.mockReturnValue('development');
      api.caller.mockImplementation(cb => cb(caller));
      const reactOverride = buildPreset(api, options).overrides.find(
        o => o.presets,
      );
      expect(reactOverride.presets[0][1].developmentSourceSelf).toBe(expected);
    },
  );

  it.each([
    ['18.3.1', true],
    ['19.1.0', true],
    ['19.2.0', false],
    ['19.2.0-rc.1', false],
    ['20.0.0', false],
  ])('React %s => developmentSourceSelf %s', (version, expected) => {
    api.env.mockReturnValue('development');
    const reactOverride = buildInProject({
      'node_modules/react/package.json': { name: 'react', version },
    }).overrides.find(o => o.presets);
    expect(reactOverride.presets[0][1].developmentSourceSelf).toBe(expected);
  });

  it('skips developmentSourceSelf in production', () => {
    api.env.mockReturnValue('production');
    api.caller.mockImplementation(cb => cb({ developmentSourceSelf: true }));
    const reactOverride = buildPreset(api).overrides.find(o => o.presets);
    expect(reactOverride.presets[0][1].developmentSourceSelf).toBe(false);
  });

  describe('automatic polyfillMethod', () => {
    function polyfillMethodFor(pkg) {
      const polyfillPlugin = buildInProject({
        'package.json': pkg,
      }).plugins.find(plugin => Array.isArray(plugin) && plugin[1]?.method);
      return polyfillPlugin?.[1].method;
    }

    it('should use usage-pure when core-js-pure is only a devDependency', () => {
      expect(
        polyfillMethodFor({ devDependencies: { 'core-js-pure': '^3.0.0' } }),
      ).toBe('usage-pure');
    });

    it('should use usage-global when core-js is listed in the same field', () => {
      expect(
        polyfillMethodFor({
          dependencies: { 'core-js': '^3.0.0', 'core-js-pure': '^3.0.0' },
        }),
      ).toBe('usage-global');
    });

    it('should check each field separately', () => {
      expect(
        polyfillMethodFor({
          dependencies: { 'core-js-pure': '^3.0.0' },
          devDependencies: { 'core-js': '^3.0.0' },
        }),
      ).toBe('usage-pure');
    });
  });
});
