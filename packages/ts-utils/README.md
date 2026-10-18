# @anansi/ts-utils

Helpers for reading TypeScript configuration with the TypeScript compiler API.

## Installation
```
yarn add --dev @anansi/ts-utils typescript
```

Requires the `typescript` JS API (TypeScript 3–6).

## Usage
```js
const { readTsConfig } = require('@anansi/ts-utils');

const { options, fileNames, errors } = readTsConfig('./', 'tsconfig.json');
```

### `readTsConfig(path = './', configName = 'tsconfig.json')`

Searches `path` and its parent directories for `configName`, then parses it, including `extends`, with `ts.parseJsonConfigFileContent`. Returns a `ts.ParsedCommandLine` (`options`, `fileNames`, `errors`, ...). Relative paths resolve against `path`.

Throws if no config file is found. Parse errors are returned in `errors`, not thrown.

TypeScript 7's `typescript` package has no JS API, so `readTsConfig` throws. Alias `typescript` to `npm:@typescript/typescript6`, and install TypeScript 7 as `"@typescript/native": "npm:typescript@^7"`.
