const path = require('path');
module.exports = {
  extends: 'plugin:@anansi/typescript',
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: { project: path.resolve(__dirname, './tsconfig.json') },
    },
  },
};
