# Sane community baseline for React and TypeScript
[![CircleCI](https://circleci.com/gh/ntucker/anansi.svg?style=shield)](https://circleci.com/gh/ntucker/anansi)
[![npm downloads](https://img.shields.io/npm/dm/@anansi/eslint-plugin.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/eslint-plugin)
[![npm version](https://img.shields.io/npm/v/@anansi/eslint-plugin.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/eslint-plugin)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Installation

`yarn add --dev @anansi/eslint-plugin`

## Usage

### TypeScript + Javascript

Be sure to configure the project option properly - especially if you have a monorepo.

**`eslint.config.js`**

```js
import anansiPlugin from '@anansi/eslint-plugin';

export default [
  anansiPlugin.configs.typescript,
  {
    languageOptions: {
      tsconfigRootDir: import.meta.dirname,
      project: ['tsconfig.json'],
    }
  }
];
```

### TypeScript monorepo

**`eslint.config.js`**

```js
import anansiPlugin from '@anansi/eslint-plugin';

export default [
  anansiPlugin.configs.typescript,
  {
    languageOptions: {
      tsconfigRootDir: import.meta.dirname,
      project: ['packages/*/tsconfig.json'],
    }
  }
];
```

### Just JavaScript

**`eslint.config.js`**

```js
import anansiPlugin from '@anansi/eslint-plugin';

export default [
  anansiPlugin.configs.javascript,
];
```

## Style guidelines

TBD
