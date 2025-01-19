const babel = require('@babel/core');
const { default: getTargets } = require('@babel/helper-compilation-targets');

const buildPreset = require('./index');

describe('Babel Transform 2024 browsers', () => {
  let api;

  beforeEach(() => {
    api = {
      assertVersion: jest.fn(),
      env: jest.fn(),
      caller: jest.fn(cb => cb({ name: '@babel/cli' })),
      targets: jest.fn(() => getTargets()),
    };
    process.env.BROWSERSLIST_ENV = '2024';
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

  it('should maintain class properties', () => {
    api.targets.mockReturnValue('development');
    const code = `class MyClass { declare myThing; myProp: number = 42; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      loose: false,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should maintain class statics', () => {
    api.targets.mockReturnValue('development');
    const code = `
    abstract class StaticEntity extends Entity {
      declare static a: string;
      static urlRoot = '/2/';

      static {
        this.a = this.urlRoot;
      }
    }
    `;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      loose: false,
    });
    expect(transformedCode).toMatchSnapshot();
  });
});
