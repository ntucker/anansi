# @anansi/polyfill

This ensures support for [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) localization object, [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) and [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). It does so using
feature detection and dynamic imports, allowing browsers that support the features to immediately progress.

## Usage

With React:

```javascript
import ReactDOM from 'react-dom';
import loadPolyfills from '@anansi/polyfill';

import MyApp from './App';

async function init() {
  await loadPolyfills();
  ReactDOM.createRoot(document.body).render(<MyApp />);
}
init();
```

It's important to delay initilization of your app until these polyfills are loaded. This is provided
by the promise returned by `loadPolyfills()`. Once that promise resolves all polyfills will be
loaded into the `global` object.

## Arguments

### include: [`intl`, `ric`, `fetch`] | 'all' = 'all'

By default all three polyfills are loaded, but if you don't use a feature (like `fetch`) you may
want to avoid loading it. Do this by passing an array of features you want to include from
[`intl`, `ric`, `fetch`].

```javascript
loadPolyfills(['intl', 'ric']); // fetch won't be loaded
```

## Supporting locales

To support locales other than english, you'll need to import them as well. They weren't included
to help with build times for sites that don't need it.

### Support spanish and german:

```javascript
for (const locale of ['es', 'de']) {
  import(
    /* webpackChunkName: "locale-request" */ `intl/locale-data/jsonp/${locale}.js`
  );
}
```

### Detect locale of browser:

```javascript
import localeFinder from 'browser-locale';

async function init() {
  await loadPolyfills();
  if (
    !global.Intl ||
    typeof global.Intl.DateTimeFormat.prototype.formatToParts !== 'function'
  ) {
    const locale = localeFinder();
    await import(
      /* webpackChunkName: "locale-request" */ `intl/locale-data/jsonp/${locale}.js`
    );
  }
  ReactDOM.createRoot(document.body).render(<MyApp />);
}
```
