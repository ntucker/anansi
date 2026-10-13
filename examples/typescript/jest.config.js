module.exports = {
  preset: '@anansi/jest-preset',
  testEnvironment: 'jsdom',
  modulePaths: ['src'],
  moduleNameMapper: {
    // @ant-design/icons' CJS build requires @ant-design/colors' ESM build
    '^@ant-design/colors/es/(.*)$': '@ant-design/colors/lib/$1',
  },
};
