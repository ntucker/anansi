# Production ready babel (with TypeScript!)

[![CircleCI](https://circleci.com/gh/ntucker/anansi.svg?style=shield)](https://circleci.com/gh/ntucker/anansi)
[![npm downloads](https://img.shields.io/npm/dm/@anansi/babel-preset.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/babel-preset)
[![npm version](https://img.shields.io/npm/v/@anansi/babel-preset.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/babel-preset)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Configurable production-ready babel preset for React projects with TypeScript support.

### Why

- Up to date best practices
- Tight multi-plugin configuration
  - Plugins made to interop correctly together
  - Centralized configuration both simplifies and ensures correctness

## Usage

Just include in .babelrc

```json
{
  "presets": ["@anansi"]
}
```

Or configure [options](#options)

<details><summary><b>Target node 10</b></summary>

```json
{
  "targets": { "node": "10" },
  "presets": [
    [
      "@anansi"
    ]
  ]
}
```
</details>

<details><summary><b>Make transforms 'loose'</b></summary>

```json
{
  "presets": [
    [
      "@anansi",
      {
        "loose": true
      }
    ]
  ]
}
```
</details>

## React refresh

In dev mode, if `react-refresh` is installed it will be enabled.

## TypeScript

TypeScript files (`.ts`, `.tsx`, `.mts`, `.cts`, etc) are supported by removing their typings to output
javascript that node/browsers can understand.

## Future language support

In addition to providing good production/development/testing transformations; some additional non-standard features
are included:

### Stage 4

- [Module level await](https://github.com/tc39/proposal-top-level-await)

### Stage 3

- [Decorators](https://github.com/tc39/proposal-decorators)

### Stage 2

- [Records and Tuples](https://github.com/tc39/proposal-record-tuple)
  - Be sure to add [@bloomberg/record-tuple-polyfill](https://www.npmjs.com/package/@bloomberg/record-tuple-polyfill)
  - Warning: this doesn't work with TypeScript

### Stage 1

- [`export v from 'mod';`](http://babeljs.io/docs/en/next/babel-plugin-proposal-export-default-from) (Disabled when using TypeScript)
- [`Decimal` parsing](https://github.com/tc39/proposal-decimal)

## Features

- [Speed up reconciliation and reduce garbage collection in production](https://github.com/facebook/react/issues/3226)
- [Babel Macros](https://github.com/kentcdodds/babel-plugin-macros)
- [TypeScript](https://www.typescriptlang.org/)
  - [TypeScript tsconfig paths support](#tsconfigpath)
- [Module resolver](https://github.com/tleunen/babel-plugin-module-resolver)
- [Root import](https://github.com/entwicklerstube/babel-plugin-root-import#readme)

## Options

### nodeTarget : ?string = undefined

> Deprecated: Prefer using [top-level](https://babel.dev/blog/2021/02/22/7.13.0#top-level-targets-option-12189httpsgithubcombabelbabelpull12189-rfchttpsgithubcombabelrfcspull2) `targets` instead

```json
{
  "targets": { "node": "current" },
  "presets": ["@anansi"]
}
```

Will run to target node instead of browsers. Specify a [valid node string](https://babeljs.io/docs/en/babel-preset-env#targetsnode) like "current", or "6.15".

If unset, will automatically target current node version when webpack is targetting node.

### targets : ?object = undefined

> Deprecated: Prefer using [top-level](https://babel.dev/blog/2021/02/22/7.13.0#top-level-targets-option-12189httpsgithubcombabelbabelpull12189-rfchttpsgithubcombabelrfcspull2) `targets` instead

Set to `{ "esmodules": true }` to produce extra optimal bundles for modern browsers that support
ES modules. This will make use of `@babel/preset-modules` instead of `@babel/preset-env`, whose transforms
are more compact and efficient.

_NOT recommended for non-`{ "esmodules": true }`._ Can be used to override `@babel/preset-env` targets
for non-testing environment.
Use a [browserslist config](https://github.com/browserslist/browserslist#packagejson) instead.

Feel free to use the [anansi browserlist config](/packages/browserslist-config-anansi).

### modules: "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false = false

Enable transformation of ES module syntax to another module type.

By default this tries to infer if ESModules is supported and if so, keep ESM. If this detection isn't
working correct, feel free to explicitly set.

### BABEL_MODULES

This will override or set `modules` option from above.

### useESModules: boolean = !(env === 'test' || options.nodeTarget)

This uses the es6 module version of [@babel/runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules).
"This allows for smaller builds in module systems like webpack, since it doesn't need to preserve commonjs semantics."

By default, tries to infer whether this can be used.

Set this to false for maximum compatibility.

### [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins): "usage" | "entry" | false = "entry"

This option configures how @anansi/babel-preset handles polyfills. Both `usage` and `entry` will
only include polyfills needed for the target.

`entry` allows you to control when/where the polyfills are loaded by
adding your own import of core-js. You can even import pieces selectively.

`usage` will add imports everywhere a file is used, which can make it harder to split polyfills if they
are not needed.

### [corejs](https://babeljs.io/docs/en/babel-preset-env#corejs): { version: 3, proposals: true }

Which core-js version to use when useBuiltIns is not false

### runtimePkg = "@babel/runtime"

Can be `@babel/runtime-corejs3` or `@babel/runtime-corejs2`. Using the corejs version will
add imports to the 'pure' form of core-js, which doesn't change global objects. This will however
result in heavily increased bundle sizes, so it's generally preferred to stay with the default.

### minify: bool = false

Setting this to true will run the minifier [babel-minify](https://github.com/babel/babel-minify)

Be sure to install babel-minify as it is listed as an optional peerdependency here.

### loose: bool = false

- class properties
- private methods
- all things in preset-env
- legacy decorators

### [decoratorsOptions](https://babeljs.io/docs/en/babel-plugin-proposal-decorators#options)

- `version`: "2023-05", "2023-01", "2022-03", "2021-12", "2018-09" or "legacy". defaults to "2023-05"
- `decoratorsBeforeExport`

### reactCompiler: {compilationMode?: "annotation"}

Run the [React Compiler](https://react.dev/learn/react-compiler). This is still experimental - be sure to
[check compatibility](https://react.dev/learn/react-compiler#checking-compatibility) before turning this on.

By default does not run. Include empty object or a configuration to turn on.

** Requires React 19+ **

** This only runs in production **

### reactRequire: bool = true

Automatically add react import if JSX is used. This is not necessary when using JSX transform from React 16.14+

### reactConstantElementsOptions: { allowMutablePropsOnTags?: string[] } | false

Configures the options for [react-constant-elements](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements).
Setting to false disables this optimization altogether. Note: this is only ever used in production mode

### hasJsxRuntime

** Defaults to `true`. Set this to `false` explicitly to use with React <=16.13 **

Use [new jsx transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).
Available in React >16.14.

- With the new transform, you can use JSX without importing React.
- Depending on your setup, its compiled output may slightly improve the bundle size.
- It will enable future improvements that reduce the number of concepts you need to learn React.

> Note: This is automatically set when using anansi webpack using the [caller config](https://babeljs.io/docs/en/options#caller)

### tsConfigPath

Specifies the tsconfig.json file location to automatically apply [tsconfig path mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

<details><summary><b>.babelrc.js</b></summary>

```js
module.exports = {
  presets: [['@anansi', { tsConfigPath: '.' }]],
};
```

</details>

Merges with [module resolver](#module-resolver-options) options

#### TS_CONFIG_PATH

Overrides `tsConfigPath`.

```bash
export TS_CONFIG_PATH = './tsconfig.json'
```

## module-resolver options

### resolverRoot

Sets the root [root](https://github.com/tleunen/babel-plugin-module-resolver/blob/HEAD/DOCS.md#root).

```js
root = ['./src'];
```

#### RESOLVER_ROOT

Overrides `resolverRoot`.

```bash
export RESOLVER_ROOT = './src'
```

### resolverAlias

JSON representation of the [alias](https://github.com/tleunen/babel-plugin-module-resolver/blob/HEAD/DOCS.md#alias) object option.

```js
{
  "underscore": "lodash",
  "^@namespace/foo-(.+)": "packages/\\1"
}
```

#### RESOLVER_ALIAS

If `RESOLVER_ALIAS` env is set, it will override this setting. Be sure to JSON encode.

```bash
export RESOLVER_ALIAS = '{"underscore":"lodash","^@namespace/foo-(.+)":"packages/\\\\1"}'
```

### resolver

Full control of [module-resolver options](https://github.com/tleunen/babel-plugin-module-resolver/blob/HEAD/DOCS.md).
Sets as default, so `resolverRoot` and `resolverAlias` will override `root` and `alias` respectively.

## root-import options

### rootPathSuffix: string = './src'

Enables importing from project root with `~/my/path` rather than using relative paths. Override
this if your project root is in another directory.

This is the recommended way to manage imports in larger libraries.

When using with typescript, be sure to add to tsconfig.json:

```json
{
  "baseUrl": "./src",
  "paths": { "~/*": ["*"] }
}
```

### rootPathPrefix: string = '~/'

Configures what prefix is used to trigger root imports.

### rootPathRoot: undefined

[Controls the root.](https://www.npmjs.com/package/babel-plugin-root-import#custom-root)
No value (undefined) means use current working directory.

Sending `__dirname` from a `.babelrc.js` can be useful to ensure consistency no matter
where babel starts running from.

### Polyfills

Usage of features that require polyfills is automatically detected and included in many cases. However,
some features (`Intl`, `requestIdleCallback` and `fetch`) are not. We recommend using
[@anansi/polyfill](https://www.npmjs.com/package/@anansi/polyfill) to cover those cases.
