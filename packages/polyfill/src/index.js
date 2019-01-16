export default function loadPolyfills(include = 'all', locale = 'en') {
  const loaders = {
    intl: () => {
      if (
        !global.Intl ||
        typeof global.Intl.DateTimeFormat.prototype.formatToParts !== 'function'
      ) {
        Promise.all([
          import(/* webpackChunkName: "intl-polyfill" */ 'intl').then(
            ({ default: Intl }) => {
              global.Intl = Intl;
              return global.Intl;
            },
          ),
          import(/* webpackChunkName: "locale-[request]" */ `intl/locale-data/jsonp/${locale}.js`),
        ]).then(args => args[0]);
      }
    },
    ric: () => {
      if (!global.requestIdleCallback) {
        return import(/* webpackChunkName: "ric-polyfill" */ 'ric-shim').then(
          ({ default: ric }) => {
            global.requestIdleCallback = ric;
            global.cancelIdleCallback =
              global.requestIdleCallback.cancelIdleCallback;
            return ric;
          },
        );
      }
    },
    fetch: () => {
      if (window && !window.fetch) {
        return import(/* webpackChunkName: "fetch-polyfill" */ 'whatwg-fetch').then(
          () => {
            return window.fetch;
          },
        );
      }
    },
  };

  const promises = [];
  if (include === 'all') {
    for (const k in loaders) {
      promises.push(loaders[k]());
    }
  } else {
    for (const k of include) {
      promises.push(loaders[k]());
    }
  }
  return Promise.all(promises);
}
