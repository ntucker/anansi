// node env
if (typeof window === 'undefined') {
  require('cross-fetch/polyfill');
  // reactnative env
} else if (typeof document === 'undefined') {
  import('node-fetch').then(({ default: fetch }) => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    globalThis.fetch = fetch;
  });
  // dom env
} else {
  require('whatwg-fetch');
  require('core-js/stable');
  window.requestIdleCallback = jest.fn().mockImplementation(cb => {
    cb();
  });
  class Worker {
    constructor(stringUrl) {
      this.url = stringUrl;
      this.onmessage = () => {};
    }

    postMessage(msg) {
      this.onmessage(msg);
    }
  }
  window.Worker = Worker;
}
