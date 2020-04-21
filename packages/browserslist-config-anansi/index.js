module.exports = {
  defaults: [
    "> 1%",
    "Firefox ESR",
    "not dead",
    "not ie<12",
    "not OperaMini all"
  ],
  legacy: [
    "> 0.5%",
    "Firefox ESR",
    "not dead",
    "not ie<11",
    "not safari<12.1",
    "not OperaMini all"
  ],
  development:  ['last 1 Chrome versions', 'last 1 Firefox versions'],
  test: ['current node'],
}
