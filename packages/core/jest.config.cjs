/* eslint-env node */
/* eslint-disable no-undef */
// Use test-specific tsconfig that includes Jest types
process.env.ANANSI_JEST_TSCONFIG = 'tsconfig.test.json';

module.exports = {
  preset: '@anansi/jest-preset',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__fixtures__/**',
  ],
  coverageDirectory: 'coverage',
  testTimeout: 30000, // Longer timeout for integration tests
};
