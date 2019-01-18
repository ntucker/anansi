type LoaderKeys = 'intl' | 'ric' | 'fetch';
export default function loadPolyfills(include: 'all' | LoaderKeys[] = 'all') {
  const loaders:{ [k in LoaderKeys]: () => Promise<unknown> | undefined} = {
    intl: () => {
      if (
        !global.Intl ||
        typeof global.Intl.DateTimeFormat.prototype.formatToParts !== 'function'
      ) {
      return Promise.all([
        import(/* webpackChunkName: "intl-polyfill" */ 'intl').then(
          ({ default: Intl }) => {
            global.Intl = Intl;
            return global.Intl;
          },
        ),
        import(/* webpackChunkName: "locale-en" */ `intl/locale-data/jsonp/en`),
      ]).then(args => args[0]);
      }
    },
    ric: () => {
      if (!global.requestIdleCallback) {
        return import(/* webpackChunkName: "ric-polyfill" */ 'ric-shim').then(
          ({ default: ric }) => {
            global.requestIdleCallback = ric;
            global.cancelIdleCallback = ric.cancelIdleCallback;
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

  const promises: Promise<unknown>[] = [];
  if (include === 'all') {
    for (const k in loaders) {
      const promise = loaders[k as LoaderKeys]();
      if (promise) {
        promises.push(promise);
      }
    }
  } else {
    for (const k of include) {
      const promise = loaders[k]();
      if (promise) {
        promises.push(promise);
      }
    }
  }
  return Promise.all(promises);
}
