# Anansi browserslist-config

Sensible modern browser support for production, latest Chrome & Firefox for development.

## Installation
```
yarn add --dev @anansi/browserslist-config
```

## Usage
Add this to your `package.json` file:
```
"browserslist": [
  "extends @anansi/browserslist-config"
]
```

## Environments

Set via `BROWSERSLIST_ENV` or `env` or `NODE_ENV` environmental variables. Unmatched environments use `defaults`.

- `defaults`: `> 1%, Firefox ESR, not dead, not ie<12, not OperaMini all, last 1 years`
- `legacy`: `> 0.5%, Firefox ESR, since 2018 and supports es6-module, not dead, not ie<11, not safari<12.1, not OperaMini all`
- `modern`: last 2 Firefox, Firefox ESR, last 3 Chrome and Android Chrome, last 1 Safari, last 2 iOS, last 1 Edge
- `development`: `last 1 Chrome versions, last 1 Firefox versions`
- `test`: `current node, last 1 Chrome versions, last 1 Firefox versions`
- `server`: `current node`
- `2017` … `2027`: `since <year> and supports es6-module` (`2017` also excludes Opera Mini; `2018` excludes Chrome < 67)
- `node10` … `node26` (even versions): `node <version>`
- `hermes11` … `hermes16`: the Safari version matching each React Native Hermes release

See [`index.js`](./index.js) for the exact queries.
