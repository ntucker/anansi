module.exports = {
  defaults: [
    '> 1%',
    'Firefox ESR',
    'not dead',
    'not ie<12',
    'not OperaMini all',
    'last 1 years',
  ],
  legacy: [
    '> 0.5%',
    'Firefox ESR',
    'since 2018 and supports es6-module',
    'not dead',
    'not ie<11',
    'not safari<12.1',
    'not OperaMini all',
  ],
  modern: [
    'last 2 Firefox versions',
    'Firefox ESR',
    'last 3 Chrome versions',
    'last 3 and_chr versions',
    'last 1 Safari versions',
    'last 2 iOS versions',
    'last 1 Edge versions',
  ],
  development: ['last 1 Chrome versions', 'last 1 Firefox versions'],
  2017: ['since 2017 and supports es6-module'],
  2018: ['since 2018 and supports es6-module'],
  2019: ['since 2019 and supports es6-module'],
  2020: ['since 2020 and supports es6-module'],
  2021: ['since 2021 and supports es6-module'],
  2022: ['since 2022 and supports es6-module'],
  test: ['current node', 'last 1 Chrome versions', 'last 1 Firefox versions'],
  server: ['current node'],
  node10: ['node 10'],
  node12: ['node 12'],
  node14: ['node 14'],
  node16: ['node 16'],
  node18: ['node 18'],
};
