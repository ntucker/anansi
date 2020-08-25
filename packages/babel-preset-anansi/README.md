# Anansi's React Babel Preset
[![CircleCI](https://circleci.com/gh/ntucker/anansi.svg?style=shield)](https://circleci.com/gh/ntucker/anansi)
[![npm downloads](https://img.shields.io/npm/dm/@anansi/babel-preset.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/babel-preset)
[![npm version](https://img.shields.io/npm/v/@anansi/babel-preset.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/babel-preset)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Configurable production-ready babel preset for React projects.

### Why

- Up to date best practices
- Tight multi-plugin configuration
  - Plugins made to interop correctly together
  - Centralized configuration both simplifies and ensures correctness

## Usage

Just include in .babelrc

```json
{
  "presets": ["@anansi/babel-preset"]
}
```

Or configure options

```json
{
  "presets": [
    [
      "@anansi/babel-preset",
      {
        "nodeTarget": "10"
      }
    ]
  ]
}
```

```json
{
  "presets": [
    [
      "@anansi/babel-preset",
      {
        "typing": "typescript"
      }
    ]
  ]
}
```

## React refresh

In dev mode, if `react-refresh` is installed it will be enabled.

## Options

### typing: 'flow' | 'typescript' | false = false

Adds support for these typecheckers. These remove the typings so the output runs in the target environment.
If false, no static typechecker will be supported.

Supports TypeScript 4.0

### nodeTarget : ?string = undefined

Will run to target node instead of browsers. Specify a [valid node string](https://babeljs.io/docs/en/babel-preset-env#targetsnode) like "current", or "6.15".

If unset, will automatically target current node version when webpack is targetting node.

### targets : ?object = undefined

Set to `{ "esmodules": true }` to produce extra optimal bundles for modern browsers that support
ES modules. This will make use of `@babel/preset-modules` instead of `@babel/preset-env`, whose transforms
are more compact and efficient.

_NOT recommended for non-`{ "esmodules": true }`._ Can be used to override `@babel/preset-env` targets
for non-testing environment.
Use a [browserslist config](https://github.com/browserslist/browserslist#packagejson) instead.

Feel free to use the [anansi browserlist config](/packages/browserslist-config-anansi).

### modules: string|false = false

Can be used to override our default of false in non-testing environments
in case you want babel to transform imports.

Warning: something other than 'false' will disable HMR and 'tree shaking'
in webpack

### useESModules: boolean = !(env === 'test' || options.nodeTarget)

This uses the es6 module version of [@babel/runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules).
"This allows for smaller builds in module systems like webpack, since it doesn't need to preserve commonjs semantics."

Set this to false for maximum compatibility.

### [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins): "usage" | "entry" | false = "entry"

This option configures how @anansi/babel-preset handles polyfills.

### [corejs](https://babeljs.io/docs/en/babel-preset-env#corejs): { version: 3, proposals: true }

Which core-js version to use when useBuiltIns is not false

### minify: bool = false

Setting this to true will run the minifier [babel-minify](https://github.com/babel/babel-minify)

Be sure to install babel-minify as it is listed as an optional peerdependency here.

### loose: bool = false

- class properties
- private methods
- all things in preset-env
- legacy decorators

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

### reactRequire: bool = true

Automatically add react import if JSX is used.

### hotReloader: boolean = false

Using react-hot-reloader instead of react-refresh

### reactConstantElementsOptions: { allowMutablePropsOnTags?: string[] } | false

Configures the options for [react-constant-elements](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements).
Setting to false disables this optimization altogether. Note: this is only ever used in production mode

## Future language support

In addition to providing good production/development/testing transformations; some additional non-standard features
are included:

### Stage 3

- [Private instance methods](https://github.com/tc39/proposal-private-methods#private-methods-and-fields)
- [Class properties](http://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties)
- [Decorators](https://github.com/tc39/proposal-decorators)
- [`a.?b.?()`](http://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining)
- [`var foo = object.foo ?? "default"`](http://babeljs.io/docs/en/next/babel-plugin-proposal-nullish-coalescing-operator)
- [Module level await](https://github.com/tc39/proposal-top-level-await)

### Stage 1

- [`export v from 'mod';`](http://babeljs.io/docs/en/next/babel-plugin-proposal-export-default-from) (Disabled when using TypeScript)
- [`Decimal` parsing](https://github.com/tc39/proposal-decimal)

### Other

- [Root import](https://github.com/entwicklerstube/babel-plugin-root-import#readme)
- [Macros](https://github.com/kentcdodds/babel-plugin-macros)

### Polyfills

Usage of features that require polyfills is automatically detected and included in many cases. However,
some features (`Intl`, `requestIdleCallback` and `fetch`) are not. We recommend using
[@anansi/polyfill](https://www.npmjs.com/package/@anansi/polyfill) to cover those cases.
