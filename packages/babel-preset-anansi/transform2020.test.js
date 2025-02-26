const babel = require('@babel/core');

const buildPreset = require('./index');

describe('buildPreset - Babel Transform', () => {
  let api;

  beforeEach(() => {
    const {
      default: getTargets,
    } = require('@babel/helper-compilation-targets');
    api = {
      assertVersion: jest.fn(),
      env: jest.fn(),
      caller: jest.fn(cb => cb({ name: '@babel/cli' })),
      targets: jest.fn(() => getTargets()),
    };
    process.env.BROWSERSLIST_ENV = '2020';
    process.env.NODE_ENV = 'development';
  });

  const transformCode = (
    code,
    options = {
      hasJsxRuntime: true,
      loose: true,
    },
  ) => {
    const preset = buildPreset(api, options);
    return babel.transformSync(code, {
      filename: 'file.tsx',
      presets: [preset],
    }).code;
  };

  it('should select polyfill entries with entry-global', () => {
    api.env.mockReturnValue('development');
    const code = `import 'core-js';class MyClass { declare myThing; myProp: number = 42; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      polyfillMethod: 'entry-global',
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should not inject Promise polyfill', () => {
    const code = `Promise.resolve()`;
    const transformedCode = transformCode(code);
    expect(transformedCode).not.toContain('core-js');
  });

  it('should not inject WeakMap polyfill', () => {
    const code = `const mymap = new WeakMap();`;
    const transformedCode = transformCode(code);
    expect(transformedCode).not.toContain('core-js');
  });

  it('chrome>90 should not inject Array.reduce polyfill', () => {
    process.env.POLYFILL_TARGETS = 'chrome>90';
    const code = `Object.keys(definition).reduce((entitySchema, key) => {
      const schema = definition[key];
      return { ...entitySchema, [key]: schema };
    }, this.schema || {});
    `;
    const transformedCode = transformCode(code);
    expect(transformedCode).not.toContain('core-js');
    process.env.POLYFILL_TARGETS = '';
  });
});
