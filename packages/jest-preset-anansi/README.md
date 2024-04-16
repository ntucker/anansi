# 🕷 Anansi Jest Preset
[![CircleCI](https://circleci.com/gh/ntucker/anansi.svg?style=shield)](https://circleci.com/gh/ntucker/anansi)
[![npm downloads](https://img.shields.io/npm/dm/@anansi/jest-preset.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/jest-preset)
[![npm version](https://img.shields.io/npm/v/@anansi/jest-preset.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/jest-preset)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Testing should just work

## Usage

<details open><summary><b>/jest.config.js</b></summary>

```js
module.exports = {
  preset: "@anansi/jest-preset"
}
```

</details>

See [@anansi/webpack-config](https://github.com/ntucker/anansi/tree/master/packages/webpack-config-anansi#file-support) for full list of module formats supported.

## Motivation

[Anansi's webpack](https://www.npmjs.com/package/@anansi/webpack-config) automatically makes media files, svgs, scss/css modules, webworkers and TypeScript or babel work automatically.
Using this preset enables all those module types to be handled in exactly as you'd expect with the webpack config.

## ENV customization

Jest doesn't give much flexibility with regard to presets, so we provide some environmental variables
to do customizations that impact multiple aspects of the configuration. However, this can also be done in a javascript
jest config like so:

<details><summary><b>/jest.config.js</b></summary>

```js
process.env.ANANSI_JEST_BABELCONFIG = 'babel.config.js';
process.env.ANANSI_JEST_TSCONFIG = 'tsconfig.test.json';

module.exports = {
  preset: '@anansi/jest-preset',
};
```

</details>


### ANANSI_JEST_TSCONFIG = 'tsconfig.json'

It might be useful to have a specific tsconfig for tests that inherits from the base config.
Use this variable to have jest pickup that file instead.

### ANANSI_JEST_BABELCONFIG = true

By default jest will automatically search for the appropriate babel configuration (with the value of `true`).
In case this doesn't work you can specify a string for the babel configuration.

Using 'babel.config.js' will automatically invoke the `rootMode: 'upward'` algorithm.

### ANANSI_JEST_TYPECHECK = true

If set to 'false', this disables type checking which can reduce memory usage quite a bit.

This can be useful when running tests in multiple environments as the environment often doesn't
impact typing, making re-checking types a waste of resources.
