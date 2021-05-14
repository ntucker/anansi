import BaseWorker from '@anansi/jest-preset/lib/transformers/worker-loader/lib/baseworker';
/* {% WORKER_IMPORTS %} */

export default class WebWorker extends BaseWorker {
  main(
    self: any,
    addEventListener: any,
    removeEventListener: any,
    dispatchEvent: any,
    postMessage: any,
    terminate: any,
  ) {
    /* {% WORKER_CODE %} */
    return onmessage || self.onmessage;
  }
}
