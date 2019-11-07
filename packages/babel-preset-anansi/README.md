# Anansi's React Babel Preset

Configurable production-ready babel preset for React projects.

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

## Options

### typing: 'flow' | 'typescript' | false = false

Adds support for these typecheckers. These remove the typings so the output runs in the target environment.
If false, no static typechecker will be supported.

### nodeTarget : ?string = undefined

Will run to target node instead of browsers. Specify a [valid node string](https://babeljs.io/docs/en/babel-preset-env#targetsnode) like "current", or "6.15".

### targets : ?object = undefined

*NOT recommended.* Can be used to override babel-preset-env targets for non-testing environment.
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

### loose: bool = false

Loose:

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
  "paths": {"~/*": ["*"]},
}
```

### rootPathPrefix: string = '~/'

Configures what prefix is used to trigger root imports.

### reactRequire: bool = true

Automatically add react import if JSX is used.

## Future language support

In addition to providing good production/development/testing transformations; some additional non-standard features
are included:

### Stage 3
* Dynamic import (`import()`)
* [Private instance methods](https://github.com/tc39/proposal-private-methods#private-methods-and-fields)
* [Class properties](http://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties)
* [Decorators](https://github.com/tc39/proposal-decorators)
* [`a.?b.?()`](http://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining)
* [`var foo = object.foo ?? "default"`](http://babeljs.io/docs/en/next/babel-plugin-proposal-nullish-coalescing-operator)
* [Module level await](https://github.com/tc39/proposal-top-level-await)

### Stage 1
* [`export v from 'mod';`](http://babeljs.io/docs/en/next/babel-plugin-proposal-export-default-from)
* [`export * as ns from 'mod';`](http://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from)

### Other
* [Root import](https://github.com/entwicklerstube/babel-plugin-root-import#readme)
* [Macros](https://github.com/kentcdodds/babel-plugin-macros)

### Polyfills

Usage of features that require polyfills is automatically detected and included in many cases. However,
some features (`Intl`, `requestIdleCallback` and `fetch`) are not. We recommend using
[@anansi/polyfill](https://www.npmjs.com/package/@anansi/polyfill) to cover those cases.
