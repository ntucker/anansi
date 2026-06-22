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
});
