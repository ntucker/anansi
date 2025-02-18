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
      caller: jest.fn(cb => cb({ name: '@rollup/plugin-babel' })),
      targets: jest.fn(() => getTargets()),
    };
    process.env.BROWSERSLIST_ENV = 'node12';
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

  it('should not use esm babel/runtime3 when targetting node', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    api.caller.mockImplementation(cb => cb({ name: '@rollup/plugin-babel' }));
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    let transformedCode = transformCode(code, { loose: false });
    expect(transformedCode).not.toContain('@babel/runtime-corejs3/helpers/esm');
    expect(transformedCode).toContain('core-js-pure');
    expect(transformedCode).toContain('@babel/runtime-corejs3');
    expect(transformedCode).toMatchSnapshot();
  });
});
