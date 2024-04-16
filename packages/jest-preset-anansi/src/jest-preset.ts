/* eslint-disable @typescript-eslint/no-var-requires */
import type * as _babel from '@babel/core';

const { readTsConfig } = require('@anansi/ts-utils');
const semver = require('semver');
const { pathsToModuleNameMapper } = require('ts-jest');

const TSCONFIG = process.env.ANANSI_JEST_TSCONFIG ?? 'tsconfig.json';
const BABELCONFIG = process.env.ANANSI_JEST_BABELCONFIG ?? true;
const TYPECHECK = process.env.ANANSI_JEST_TYPECHECK ?? true;

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

module.exports = {
  babelConfig,
  default: {
    setupFiles: [require.resolve('./scripts/testSetup.js')],
    transform: {
      '^.+\\.worker.(m|c)?[t|j]s$': require.resolve(
        './transformers/worker-loader',
      ),
      '^.+\\.(m|c)?(tsx?|html)$': [
        require.resolve('ts-jest'),
        /**
         *  If you comment this out, you will get error unexpected token with optional chaining because you are using babel in your project
         *  When using babel together with ts-jest in a project, you need to let ts-jest know about it
         */
        {
          babelConfig: babelConfig,
          tsconfig: `<rootDir>/${TSCONFIG}`,
          stringifyContentPathRegex: '\\.html$',
          isolatedModules: TYPECHECK === 'false' ? true : false,
        },
      ],
      '^.+\\.(m|c)?jsx?$': [require.resolve('babel-jest'), babelConfig],
    },
    // same as default, but we transform @babel/runtime
    transformIgnorePatterns: [
      '/node_modules/(?!@babel/runtime)',
      '\\.pnp\\.[^\\/]+$',
    ],
    resolver: require.resolve(`jest-pnp-resolver`),
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m|c)?(j|t)sx?$',
    coveragePathIgnorePatterns: ['node_modules'],
    moduleFileExtensions: [
      'ts',
      'tsx',
      'mts',
      'mtsx',
      'cts',
      'js',
      'jsx',
      'mjs',
      'cjs',
      'json',
    ],
    moduleNameMapper: {
      '\\.(apng|png|jpg|gif|ico|webp|avif|cur|ani|otf|eot|woff2|woff|ttf|pdf|mp4|webm|wav|mp3|m4a|aac|oga)$':
        require.resolve('./mocks/fileMock.js'),
      '\\.(css|scss)$': require.resolve('identity-obj-proxy'),
      '\\.(svg)$': require.resolve('./mocks/svgrMock.js'),
      ...pathsToModuleNameMapper(options.paths || [], {
        prefix: `<rootDir>/${options.baseUrl}/`,
      }),
    },
  },
};
