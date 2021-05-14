Adapted from https://github.com/astagi/workerloader-jest-transformer

### Setting up Jest config file

```js
{
  transform: {
    '^.+\\.worker.[t|j]s$': require.resolve('@anansi/jest-preset/lib/transformers/worker-loader'),
  }
}
```
