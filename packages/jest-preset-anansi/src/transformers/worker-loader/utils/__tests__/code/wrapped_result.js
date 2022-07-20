/* eslint-disable no-unused-vars */
import BaseWorker from '@anansi/jest-preset/lib/transformers/worker-loader/lib/baseworker';

import workerHandler from './handlers';

export default class WebWorker extends BaseWorker {
  main(
    self,
    addEventListener,
    removeEventListener,
    dispatchEvent,
    postMessage,
    terminate,
  ) {
    workerHandler('data');

    return onmessage || self.onmessage;
  }
}
