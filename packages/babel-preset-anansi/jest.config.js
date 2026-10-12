module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  testTimeout: 60000,
  moduleFileExtensions: ['js', 'json', 'cjs'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { rootMode: 'upward' }],
  },
};
