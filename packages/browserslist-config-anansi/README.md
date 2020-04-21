# Anansi browserlist-config
Sensible [modern browser](https://browserl.ist/?q=%3E+1%25%2C+Firefox+ESR%2C+not+dead%2C+not+ie%3C12%2C+not+OperaMini+all) support for prod, [`latest firefox & chrome`](http://browserl.ist/?q=last+1+Chrome+versions%2C+last+1+Firefox+versions)
for dev.

## Installation
```
yarn add --dev @anansi/browserslist-config
```

## Usage
Add this your `package.json` file:
```
"browserslist": [
  "extends @anansi/browserslist-config"
]
```

## Environments

Set via `BROWSERSLIST_ENV` or `env` or `NODE_ENV` environmental variables.

- [default](https://browserl.ist/?q=%3E+1%25%2C+Firefox+ESR%2C+not+dead%2C+not+ie%3C12%2C+not+OperaMini+all)
- [legacy](https://browserl.ist/?q=%3E+0.5%25%2CFirefox+ESR%2Cnot+dead%2Cnot+ie%3C11%2Cnot+safari%3C12.1%2Cnot+OperaMini+all)
- [development](http://browserl.ist/?q=last+1+Chrome+versions%2C+last+1+Firefox+versions)
- [test](https://browserl.ist/?q=current+node)
