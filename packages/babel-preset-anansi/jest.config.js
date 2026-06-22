module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  testTimeout: 60000,
  moduleFileExtensions: ['js', 'json', 'cjs'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@babel|@wyw-in-js|happy-dom)/)'],
};
