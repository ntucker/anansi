module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  testTimeout: 30000,
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@wyw-in-js|happy-dom)/)'],
};

