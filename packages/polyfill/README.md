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

### locale: string = 'en'

This loads the locale data needed. Choose the default locale for your site.

```javascript
loadPolyfills('all', 'es'); // loads spanish locale
```
