// Use test-specific tsconfig that includes Jest types
process.env.ANANSI_JEST_TSCONFIG = 'tsconfig.test.json';
// root babel.config.js, so ESM-only node_modules compile to CJS
process.env.ANANSI_JEST_BABELCONFIG = 'babel.config.js';

module.exports = {
  preset: '@anansi/jest-preset',
  testEnvironment: 'node',
  // preset's @babel/runtime prefix match, plus http-proxy-middleware and its
  // ESM-only deps
  transformIgnorePatterns: [
    '/node_modules/(?!@babel/runtime|(http-proxy-middleware|httpxy|is-plain-obj)/)',
    '\\.pnp\\.[^\\/]+$',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__fixtures__/**',
  ],
  coverageDirectory: 'coverage',
  testTimeout: 30000, // Longer timeout for integration tests
};
