import ric from 'ric-shim';

type LoaderKeys = 'intl' | 'ric' | 'fetch';
export default function loadPolyfills(include: 'all' | LoaderKeys[] = 'all') {
  const loaders: { [k in LoaderKeys]: () => Promise<unknown> | undefined } = {
    intl: () => {
      if (
        !globalThis.Intl ||
        typeof globalThis.Intl.DateTimeFormat.prototype.formatToParts !==
          'function'
      ) {
        return import(/* webpackChunkName: "intl-polyfill" */ 'intl')
          .then(({ default: Intl }) => {
            globalThis.Intl = Intl;
            return globalThis.Intl;
          })
          .then(Intl => {
            return import(
              /* webpackChunkName: "locale-en" */ `intl/locale-data/jsonp/en`
            ).then(() => Intl);
          });
      }
    },
    ric: () => {
      if (!globalThis.requestIdleCallback) {
        globalThis.requestIdleCallback = ric;
        globalThis.cancelIdleCallback = ric.cancelIdleCallback;
        return Promise.resolve(ric);
      }
    },
    fetch: () => {
      if (window && !window.fetch) {
        return import(
          /* webpackChunkName: "fetch-polyfill" */ 'whatwg-fetch'
        ).then(() => {
          return window.fetch;
        });
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
