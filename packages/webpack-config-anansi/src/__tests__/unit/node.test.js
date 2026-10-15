const fs = require('fs');
const os = require('os');
const path = require('path');

const makeNodeConfig = require('../../node').default;

describe('makeNodeConfig externals under Yarn PnP', () => {
  let rootPath;
  beforeEach(() => {
    process.versions.pnp = '3';
    rootPath = fs.mkdtempSync(path.join(os.tmpdir(), 'node-config-'));
    fs.writeFileSync(
      path.join(rootPath, 'package.json'),
      JSON.stringify({
        dependencies: { react: '*', '@scope/pkg': '*' },
        devDependencies: { '@babel/runtime': '*' },
      }),
    );
  });
  afterEach(() => {
    delete process.versions.pnp;
    fs.rmSync(rootPath, { recursive: true });
  });

  function external(request, options = {}) {
    const config = makeNodeConfig(
      { output: {}, plugins: [] },
      { rootPath, serverDir: 'server', ...options },
    );
    let result;
    config.externals[0](
      {
        context: rootPath,
        request,
        contextInfo: { issuer: path.join(rootPath, 'index.js') },
      },
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
    ['undeclared', undefined],
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
