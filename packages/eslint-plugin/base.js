module.exports = {
  // TODO: instead of including TS stuff, just have the base, but then programatically order things
  // properly in the extends
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react"
  ],
  env: {
    jest: true,
    browser: true,
  },
  plugins: ['prettier', 'react-hooks', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prefer-stateless-function': 'error',
    'lines-between-class-members': [
      'warn',
      'always',
      { exceptAfterSingleLine: true },
    ],
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
    ]
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      webpack: {},
      'babel-plugin-root-import': { rootPathSuffix: './src' },
    },
  },
};
