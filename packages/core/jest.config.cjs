// Use test-specific tsconfig that includes Jest types
process.env.ANANSI_JEST_TSCONFIG = 'tsconfig.test.json';

module.exports = {
  preset: '@anansi/jest-preset',
  testEnvironment: 'node',
  // http-proxy-middleware and its deps are ESM-only
  transform: {
    '/node_modules/(http-proxy-middleware|httpxy|is-plain-obj)/.+\\.m?js$': [
      'babel-jest',
      { plugins: ['@babel/plugin-transform-modules-commonjs'] },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@babel/runtime|http-proxy-middleware|httpxy|is-plain-obj)/)',
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
