// Use test-specific tsconfig that includes Jest types
process.env.ANANSI_JEST_TSCONFIG = 'tsconfig.test.json';

module.exports = {
  preset: '@anansi/jest-preset',
  testEnvironment: 'node',
};
