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
        "typing": "flow"
      }
    ]
  ]
}
```

### Shims

This preset comes with some polyfills (babel + requestIdleCallback) for full functionality. Be sure
to include the register at the entry point

#### webpack config entry

```js
{
  entry: {
    Vendor: [
      '@anansi/babel-preset/polyfill',
      // ...
    ]
  }
}
```

#### mocha.opts

```
--require @anansi/babel-preset/registerBabel
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

### minify: bool = false

Setting this to true will run the minifier [babel-minify](https://github.com/babel/babel-minify)

### legacyDecorators: bool = false

Support legacy decorators instead of the soon-to-be-standard syntax.

### rootPathSuffix: string = './src'

Enables importing from project root with `~/my/path` rather than using relative paths. Override
this if your project root is in another directory.

### reactRequire: bool = true

Automatically add react import if JSX is used.

## Future language support

In addition to providing good production/development/testing transformations; some additional non-standard features
are included:

### Stage 3
* Dynamic import (`import()`)
* [Private instance methods](https://github.com/tc39/proposal-private-methods#private-methods-and-fields)

### Stage 2
* [Class properties](http://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties)
* [Decorators](https://github.com/tc39/proposal-decorators)

### Stage 1
* [`export v from 'mod';`](http://babeljs.io/docs/en/next/babel-plugin-proposal-export-default-from)
* [`export * as ns from 'mod';`](http://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from)
* [`a.?b.?()`](http://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining)
* [`var foo = object.foo ?? "default"`](http://babeljs.io/docs/en/next/babel-plugin-proposal-nullish-coalescing-operator)

### Other
* [Root import](https://github.com/entwicklerstube/babel-plugin-root-import#readme)
