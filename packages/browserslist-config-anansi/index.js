module.exports = {
  defaults: [
    '> 1%',
    'Firefox ESR',
    'not dead',
    'not ie<12',
    'not OperaMini all',
  ],
  legacy: [
    '> 0.5%',
    'Firefox ESR',
    'not dead',
    'not ie<11',
    'not safari<12.1',
    'not OperaMini all',
  ],
  modern: [
    'last 2 Firefox versions',
    'Firefox ESR',
    'last 2 Chrome versions',
    'last 1 Safari versions',
    'last 1 Edge versions',
  ],
  development: ['last 1 Chrome versions', 'last 1 Firefox versions'],
  test: ['current node'],
};
