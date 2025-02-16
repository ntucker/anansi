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

  it('should transform Object.hasOwn() with usage-pure', () => {
    api.env.mockReturnValue('development');
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      polyfillMethod: 'usage-pure',
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should transform Object.hasOwn() with name==@babel/runtime', () => {
    api.env.mockReturnValue('development');
    api.caller.mockImplementation(cb => cb({ name: '@babel/cli' }));
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should transform Object.hasOwn() with name==rollup-plugin-babel', () => {
    api.env.mockReturnValue('development');
    api.caller.mockImplementation(cb =>
      cb({
        name: 'rollup-plugin-babel',
        supportsStaticESM: true,
        supportsDynamicImport: true,
      }),
    );
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should transform Object.hasOwn() with caller.library', () => {
    api.env.mockReturnValue('development');
    api.caller.mockImplementation(cb => cb({ library: true }));
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should import Object.hasOwn() polyfill with usage-global', () => {
    api.env.mockReturnValue('development');
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      polyfillMethod: 'usage-global',
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should select polyfill entries with entry-global', () => {
    api.env.mockReturnValue('development');
    const code = `import 'core-js';class MyClass { declare myThing; myProp: number = 42; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      polyfillMethod: 'entry-global',
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should not transform entry polyfill import when polyfillMethod: `false`', () => {
    api.env.mockReturnValue('development');
    const code = `import 'core-js';class MyClass { declare myThing; myProp: number = 42; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      polyfillMethod: false,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should not polyfill when polyfillMethod: `false`', () => {
    api.env.mockReturnValue('development');
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      polyfillMethod: false,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should use core-js-pure by default when caller is rollup', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    api.caller.mockImplementation(cb => cb({ name: '@rollup/plugin-babel' }));
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    let transformedCode = transformCode(code, { loose: false });
    expect(transformedCode).toContain('core-js-pure');
    expect(transformedCode).toContain('@babel/runtime-corejs3');
    api.caller.mockImplementation(cb => cb({ name: 'rollup-plugin-babel' }));
    transformedCode = transformCode(code, { loose: false });
    expect(transformedCode).toContain('core-js-pure');
    expect(transformedCode).toContain('@babel/runtime-corejs3');
  });

  it('should prefer pure core-js when it is explicitly listed in pkg deps', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    api.caller.mockImplementation(cb => cb({ name: 'webpack' }));
    jest.mock(`${process.cwd()}/package.json`, () => ({
      dependencies: {
        '@babel/runtime-corejs3': '^7.26.0',
        'core-js-pure': '^3.40.0',
      },
    }));
    const code = `class MyClass { declare myThing; myProp: number = 42; }console.log(Object.hasOwn({ a: 1 }, 'a') ? 'yes' : 'no');`;
    let transformedCode = transformCode(code, { loose: false });
    expect(transformedCode).toContain('core-js-pure');
    expect(transformedCode).toContain('@babel/runtime-corejs3');
  });
});
