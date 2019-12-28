module.exports = {
  extends: 'plugin:@anansi/typescript',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  }
}
