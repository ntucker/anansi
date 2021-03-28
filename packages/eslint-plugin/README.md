# Sane community baseline for React and TypeScript
[![CircleCI](https://circleci.com/gh/ntucker/anansi.svg?style=shield)](https://circleci.com/gh/ntucker/anansi)
[![npm downloads](https://img.shields.io/npm/dm/@anansi/eslint-plugin.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/eslint-plugin)
[![npm version](https://img.shields.io/npm/v/@anansi/eslint-plugin.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/eslint-plugin)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Installation

[Eslint has decided it is necessary for users to install all plugins manually](https://github.com/eslint/rfcs/pull/5)

`yarn add --dev @anansi/eslint-plugin eslint-plugin-prettier eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks`

## Usage

### TypeScript

Be sure to configure the project option properly - especially if you have a monorepo.

**`.eslintrc.js`**

```js
module.exports = {
  extends: 'plugin:@anansi/typescript',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  }
}
```

### TypeScript monorepo

**`.eslintrc.js`**

```js
module.exports = {
  extends: 'plugin:@anansi/typescript',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['packages/*/tsconfig.json'],
  }
}
```

### Flow

**`.eslintrc.js`**

```js
{
  extends: 'plugin:@anansi/flow'
}
```

## Style guidelines

TBD
