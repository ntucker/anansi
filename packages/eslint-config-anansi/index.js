module.exports = {
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    // changing airbnb defaults
    'global-require': 'off',
    'no-multi-assign': 'off',
    'no-underscore-dangle': 'off',
    'guard-for-in': 'warn',
    'no-param-reassign': ['error', { props: false }],
    'no-shadow': [
      'warn',
      {
        allow: ['resolve', 'reject', 'done', 'cb'],
      },
    ],
    'no-unused-vars': [
      'error',
      { vars: 'local', args: 'after-used', ignoreRestSiblings: true },
    ],
    'one-var': ['error', { initialized: 'never' }],
    'one-var-declaration-per-line': ['error', 'initializations'],
    'no-named-as-default': 'off', // doesn't handle relative imports properly
    'lines-between-class-members': ['warning', 'always', { exceptAfterSingleLine: true }],
    'react/jsx-no-bind': [
      'error',
      {
        ignoreRefs: false,
        allowArrowFunctions: true,
        allowBind: false,
      },
    ],
    'react/jsx-filename-extension': 'off',
    'react/react-in-jsx-scope': 'off', // we implicitly add react import
    // babel support
    'no-unused-expressions': 'off',
    'babel/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      },
    ],
    'object-curly-spacing': 'off',
    'babel/object-curly-spacing': ['error', 'always'],
    // opinions
    // additional rules
    'import/order': [
      'warn',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ],
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/newline-after-import': ['error', { count: 2 }],
  },
  plugins: ['flowtype', 'react', 'import', 'babel'],
  settings: {
    'import/resolver': {
      webpack: {},
      'babel-plugin-root-import': { rootPathSuffix: './src' },
    },
  },
};
