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
    process.env.BROWSERSLIST_ENV = '2018';
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

  it('should transform JSX in development', () => {
    api.env.mockReturnValue('development');
    const code = `const element = <div>Hello World</div>;`;
    // remove first line (var _jsxFileName = ???)
    const transformedCode = transformCode(code).split('\n').slice(1).join('\n');
    expect(transformedCode).toMatchSnapshot();
  });

  it('should transform JSX in production', () => {
    api.env.mockReturnValue('production');
    const code = `const element = <div>Hello World</div>;`;
    const transformedCode = transformCode(code);
    expect(transformedCode).toMatchSnapshot();
  });

  it('should transform TypeScript to JavaScript', () => {
    api.env.mockReturnValue('development');
    const code = `const x: number = 42;`;
    const transformedCode = transformCode(code);
    expect(transformedCode).toMatchSnapshot();
  });

  it('should not apply class properties transform when loose', () => {
    api.env.mockReturnValue('development');
    const code = `class MyClass { declare myThing; myProp: number = 42; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      loose: true,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should apply class properties transform when not loose', () => {
    api.env.mockReturnValue('development');
    const code = `class MyClass { declare myThing; myProp: number = 42; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      loose: false,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should transform class statics', () => {
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
      loose: true,
    });
    expect(transformedCode).toMatchSnapshot();
  });
});
