import BaseWorker from '@anansi/jest-preset/lib/transformers/worker-loader/lib/baseworker';
/* {% WORKER_IMPORTS %} */

export default class WebWorker extends BaseWorker {
  main(
    self,
    addEventListener,
    removeEventListener,
    dispatchEvent,
    postMessage,
    terminate,
  ) {
    /* {% WORKER_CODE %} */
    return onmessage || self.onmessage;
  }
}
