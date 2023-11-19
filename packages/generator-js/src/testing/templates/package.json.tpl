{
  "scripts": {
    "test": "NODE_ENV=test jest",
    "test:ci": "run test -- --ci",
    "test:watch": "run test -- --watch",
    "test:coverage": "run test -- --coverage"
  },
  "eslintConfig": {
    "ignorePatterns": ["<%= assetPath %>", "jest.config.js"]
  }
}
