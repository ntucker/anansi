module.exports = function loadPolyfills(include = 'all', locale = 'en') {
  const loaders = {
    intl: async () => {
      if (
        !global.Intl
        || typeof global.Intl.DateTimeFormat.prototype.formatToParts !== 'function'
      ) {
        global.Intl = await import(/* webpackChunkName: "intl-polyfill" */ 'intl');
        await import(/* webpackChunkName: "locale-[request]" */ `intl/locale-data/jsonp/${locale}.js`);
        return global.Intl;
      }
    },
    ric: async () => {
      if (!global.requestIdleCallback) {
        global.requestIdleCallback = await import(/* webpackChunkName: "ric-polyfill" */ 'ric-shim');
        global.cancelIdleCallback = global.requestIdleCallback.cancelIdleCallback;
        return global.requestIdleCallback;
      }
    },
    fetch: async () => {
      if (window && !window.fetch) {
        await import(/* webpackChunkName: "fetch-polyfill" */ 'whatwg-fetch');
        return window.fetch;
      }
    },
  };

  const promises = [];
  if (include === 'all') {
    for (const loader of loaders.values()) {
      promises.push(loader());
    }
  } else {
    for (const k of include) {
      promises.push(loaders[k]());
    }
  }
  return Promise.all(promises);
};
