module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**',
    '!src/**/__fixtures__/**',
  ],
  coverageDirectory: 'coverage',
  testTimeout: 30000, // Longer timeout for integration tests
  moduleFileExtensions: ['js', 'json', 'cjs'],
  transform: {
    '^.+\\.js$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@anansi|@babel|ramda)/)',
  ],
  setupFilesAfterEnv: [],
};

