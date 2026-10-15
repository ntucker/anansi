const module = require('module');

const makeNodeConfig = require('../../node').default;

describe('makeNodeConfig externals under Yarn PnP', () => {
  const findPnpApi = module.findPnpApi;
  beforeEach(() => {
    module.findPnpApi = () => ({
      getAllLocators: () => [
        { name: 'react' },
        { name: '@babel/runtime' },
        { name: '@scope/pkg' },
      ],
    });
  });
  afterEach(() => {
    module.findPnpApi = findPnpApi;
  });

  function external(request, options = {}) {
    const config = makeNodeConfig(
      { output: {}, plugins: [] },
      { rootPath: '/project', serverDir: 'server', ...options },
    );
    let result;
    config.externals[0](
      { request, contextInfo: { issuer: '/project/src/index.js' } },
      (err, value) => (result = value),
    );
    return result;
  }

  it.each([
    ['react', 'commonjs react'],
    ['react/jsx-runtime', 'commonjs react/jsx-runtime'],
    ['@scope/pkg/sub', 'commonjs @scope/pkg/sub'],
    ['@babel/runtime/helpers/extends', undefined],
    ['./local', undefined],
    ['unknown', undefined],
    ['react/styles.css', undefined],
  ])('%s -> %s', (request, expected) => {
    expect(external(request)).toBe(expected);
  });

  it('bundles libraryInclude matches', () => {
    expect(external('@scope/pkg', { libraryInclude: /@scope/ })).toBe(
      undefined,
    );
  });
});
