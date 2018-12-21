const env =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

const config = {
  production: ['last 2 versions', 'not < 0.05%', 'not dead', 'not op_mini all'],
  development: ['last 1 Chrome versions', 'last 1 Firefox versions'],
};

module.export = config[env];
