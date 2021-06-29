/* eslint-disable @typescript-eslint/no-var-requires */
import type * as _babel from 'babel__core';

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { readTsConfig } = require('@anansi/ts-utils');
const semver = require('semver');

const TSCONFIG = process.env.ANANSI_JEST_TSCONFIG ?? 'tsconfig.json';
const BABELCONFIG = process.env.ANANSI_JEST_BABELCONFIG ?? true;

const { options } = readTsConfig('./', TSCONFIG);

let react;
try {
  react = require(require.resolve('react'));
  // eslint-disable-next-line no-empty
} catch (e) {}
const hasJsxRuntime = react ? semver.gte(react.version, '16.14.0') : false;

const babelConfig: _babel.TransformOptions = {
  caller: { hasJsxRuntime, noHotReload: true, target: 'node' } as any,
};
if (typeof BABELCONFIG === 'string' && BABELCONFIG === 'babel.config.js') {
  babelConfig.rootMode = 'upward';
} else {
  babelConfig.configFile = BABELCONFIG;
}

module.exports.babelConfig = babelConfig;

module.exports = {
  /**
   *  If you comment this out, you will get error unexpected token with optional chaining because you are using babel in your project
   *  When using babel together with ts-jest in a project, you need to let ts-jest know about it
   */
  globals: {
    'ts-jest': {
      babelConfig: babelConfig,
      tsconfig: `<rootDir>/${TSCONFIG}`,
      stringifyContentPathRegex: '\\.html$',
    },
  },
  transform: {
    '^.+\\.worker.[t|j]s$': require.resolve('./transformers/worker-loader'),
    '^.+\\.(tsx?|html)$': require.resolve('ts-jest'),
    '^.+\\.jsx?$': [require.resolve('babel-jest'), babelConfig],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(j|t)sx?$',
  coveragePathIgnorePatterns: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'json'],
  moduleNameMapper: {
    '\\.(apng|png|jpg|gif|ico|webp|avif|cur|ani|otf|eot|woff2|woff|ttf|pdf|mp4|webm|wav|mp3|m4a|aac|oga)$':
      require.resolve('./mocks/fileMock.js'),
    '\\.(css|scss)$': require.resolve('identity-obj-proxy'),
    '\\.(svg)$': require.resolve('./mocks/svgrMock.js'),
    ...pathsToModuleNameMapper(options.paths || [], {
      prefix: `<rootDir>/${options.baseUrl}/`,
    }),
  },
};
