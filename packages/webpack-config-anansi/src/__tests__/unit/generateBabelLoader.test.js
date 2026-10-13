const fs = require('fs');
const os = require('os');
const path = require('path');

const { generateBabelLoader } = require('../../base/generateBabelLoader');

describe('generateBabelLoader', () => {
  let rootPath;
  afterEach(() => fs.rmSync(rootPath, { recursive: true, force: true }));

  function callerFor(reactVersion, target) {
    rootPath = fs.mkdtempSync(path.join(os.tmpdir(), 'anansi-react-'));
    const reactDir = path.join(rootPath, 'node_modules/react');
    fs.mkdirSync(reactDir, { recursive: true });
    fs.writeFileSync(
      path.join(reactDir, 'package.json'),
      JSON.stringify({ name: 'react', version: reactVersion }),
    );
    fs.writeFileSync(
      path.join(reactDir, 'index.js'),
      `exports.version = '${reactVersion}';`,
    );
    return generateBabelLoader({
      rootPath,
      babelRoot: rootPath,
      target,
      mode: 'development',
    }).options.caller;
  }

  it.each([
    ['16.13.1', 'web', false],
    ['16.13.1', 'node', false],
    ['16.14.0', 'web', true],
    ['17.0.2', 'node', true],
    ['18.3.1', 'node', true],
  ])('React %s on %s => hasJsxRuntime %s', (version, target, expected) => {
    expect(callerFor(version, target).hasJsxRuntime).toBe(expected);
  });
});
