module.exports = {
  extends: [
    './base.js',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      rules: {
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/unbound-method': 'warn',
        '@typescript-eslint/no-unnecessary-type-assertion': [
          'error',
          { typesToIgnore: ['any'] },
        ]
      },
    },
  ]
};
