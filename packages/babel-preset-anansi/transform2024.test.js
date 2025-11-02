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
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';

    const code = `class MyClass { declare myThing; myProp: number = 42; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      loose: false,
    });
    expect(transformedCode).toMatchSnapshot();
  });

  it('should maintain class statics', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';

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

  it('should compile react memoizations', () => {
    api.env.mockReturnValue('production');
    process.env.NODE_ENV = 'production';
    const code = `
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
    `;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      loose: false,
      reactCompiler: {},
    });
    expect(transformedCode).toContain('from "react/compiler-runtime"');
    expect(transformedCode).toMatchSnapshot();
  });

  it('should not transform import.meta.url when ESM modules are preserved', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    api.caller.mockImplementation(cb =>
      cb({ name: 'webpack', supportsStaticESM: true }),
    );
    const code = `const url = import.meta.url;`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      modules: false,
    });
    // import.meta.url should remain as-is when ESM modules are preserved
    expect(transformedCode).toContain('import.meta.url');
    expect(transformedCode).not.toMatch(/require\(['"]url['"]\)/);
  });

  it('should transform import.meta.url when CommonJS modules are used', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    api.caller.mockImplementation(cb =>
      cb({ name: 'webpack', supportsStaticESM: false }),
    );
    const code = `const url = import.meta.url;`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
      modules: 'auto',
    });
    // import.meta.url should be transformed to CommonJS-compatible code
    expect(transformedCode).not.toContain('import.meta.url');
  });

  it('should not transform typeof Symbol for modern browsers', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    const code = `const isSymbol = typeof Symbol() === 'symbol';`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
    });
    // transform-typeof-symbol is excluded because it makes all code slower
    // The typeof should remain untransformed for modern browsers
    expect(transformedCode).toContain('typeof');
    expect(transformedCode).toContain('Symbol');
  });

  it('should preserve modern syntax with bugfixes mode', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    // Test a feature that bugfixes mode affects (e.g., optional chaining in specific contexts)
    const code = `const result = obj?.prop?.nested;`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
    });
    // For modern 2024 browsers, optional chaining should be preserved
    expect(transformedCode).toContain('?.');
  });

  it('should support shipped proposals with modern browsers', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    // Test a shipped proposal feature (e.g., top-level await if supported)
    const code = `const data = await fetch('api');`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
    });
    // With shippedProposals enabled, modern proposals should be handled appropriately
    expect(transformedCode).toBeDefined();
    expect(transformedCode).toContain('await');
  });

  it('should not include react-refresh for Next.js server builds', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    api.caller.mockImplementation(cb =>
      cb({ name: 'next-babel-turbo-loader', isServer: true }),
    );
    const code = `function Component() { return <div>Hello</div>; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
    });
    // React refresh should not be applied to server builds
    expect(transformedCode).not.toContain('$RefreshReg$');
    expect(transformedCode).not.toContain('$RefreshSig$');
  });

  it('should include react-refresh for Next.js client builds', () => {
    api.env.mockReturnValue('development');
    process.env.NODE_ENV = 'development';
    api.caller.mockImplementation(cb =>
      cb({ name: 'next-babel-turbo-loader', isServer: false }),
    );
    const code = `function Component() { return <div>Hello</div>; }`;
    const transformedCode = transformCode(code, {
      hasJsxRuntime: true,
    });
    // React refresh should be applied to client builds in development
    expect(transformedCode).toContain('$RefreshReg$');
  });
});
