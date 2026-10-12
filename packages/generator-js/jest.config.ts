import type { Config } from 'jest';

const config: Config = {
  preset: '@anansi/jest-preset',
  testEnvironment: 'node',
  testTimeout: 120_000,
  rootDir: '.',
  globalSetup: './jest.globalSetup.js',
  testPathIgnorePatterns: ['/generators/', '/templates/'],
};

export default config;
