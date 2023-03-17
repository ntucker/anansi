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
