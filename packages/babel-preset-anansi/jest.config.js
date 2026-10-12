module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  testTimeout: 60000,
  moduleFileExtensions: ['js', 'json', 'cjs'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  // node_modules stay untransformed: Node 24.9+ require()s Babel 8's ESM natively,
  // and transpiling it on a cold cache nearly exhausts the linaria test's timeout
};
