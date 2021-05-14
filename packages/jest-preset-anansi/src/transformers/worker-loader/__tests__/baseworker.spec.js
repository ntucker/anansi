import BaseWorker from './lib/baseworker';

class TestWorker extends BaseWorker {
  main(
    self,
    addEventListener,
    removeEventListener,
    dispatchEvent,
    postMessage,
    terminate,
  ) {
    const onmessage = e => {
      if (!e.data) throw Error();
      postMessage(e.data * 2);
    };
    return onmessage;
  }
}

const sleep = t =>
  new Promise(r => {
    setTimeout(r, t);
  });

describe('BaseWorker class', () => {
  describe('execution', () => {
    it('instantiate a BaseWorker', async () => {
      const worker = new TestWorker();
      worker.onmessage = jest.fn();
      worker.postMessage(5);
      await sleep(10);
      expect(worker.onmessage).toHaveBeenCalledWith({ data: 10 });
    });
    it('handles errors correctly', async () => {
      const worker = new TestWorker();
      worker.onerror = jest.fn();
      worker.postMessage(undefined);
      await sleep(10);
      expect(worker.onerror).toHaveBeenCalled();
    });
    it('terminate a worker', async () => {
      const worker = new TestWorker();
    });
  });
});
