/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { readTsConfig } = require('@anansi/ts-utils');

const TSCONFIG = process.env.ANANSI_JEST_TSCONFIG ?? 'tsconfig.json';
let BABELCONFIG = process.env.ANANSI_JEST_BABELCONFIG ?? true;
if (typeof BABELCONFIG === 'string' && BABELCONFIG !== 'babel.config.js') {
  BABELCONFIG = require(BABELCONFIG);
}

const { options } = readTsConfig('./', TSCONFIG);

module.exports = {
  /**
   *  If you comment this out, you will get error unexpected token with optional chaining because you are using babel in your project
   *  When using babel together with ts-jest in a project, you need to let ts-jest know about it
   */
  globals: {
    'ts-jest': {
      babelConfig: BABELCONFIG,
      tsconfig: `<rootDir>/${TSCONFIG}`,
      stringifyContentPathRegex: '\\.html$',
    },
  },
  transform: {
    '^.+\\.worker.[t|j]s$': require.resolve('./transformers/worker-loader'),
    '^.+\\.(tsx?|html)$': 'ts-jest',
    '^.+\\.jsx?$': [
      'babel-jest',
      BABELCONFIG === 'babel.config.js' ? { rootMode: 'upward' } : {},
    ],
  },
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(j|t)sx?$',
  coveragePathIgnorePatterns: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
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
