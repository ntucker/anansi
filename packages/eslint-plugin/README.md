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
