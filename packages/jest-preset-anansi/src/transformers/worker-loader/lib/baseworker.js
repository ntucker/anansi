const mitt = require('mitt');

class BaseWorker {
  constructor() {
    const inside = mitt();
    const outside = mitt();

    const self = {};

    self.addEventListener = outside.on;
    self.removeEventListener = outside.off;
    self.dispatchEvent = outside.emit;
    self.postMessage = data => {
      inside.emit('message', { data });
    };
    self.terminate = () => {
      console.log('Warning: this method is not supported yet');
    };

    this.onmessage = null;
    this.onerror = null;
    this.dispatchEvent = inside.emit;
    this.addEventListener = inside.on;
    this.removeEventListener = inside.off;
    this.postMessage = data => {
      outside.emit('message', { data });
    };

    inside.on('message', e => {
      if (this.onmessage) this.onmessage(e);
    });
    inside.on('error', e => {
      if (this.onerror) this.onerror(e);
    });

    const onmessage = this.main(
      self,
      self.addEventListener,
      self.removeEventListener,
      self.dispatchEvent,
      self.postMessage,
      self.terminate,
    );

    outside.on('message', e => {
      try {
        if (onmessage) onmessage(e);
      } catch (error) {
        inside.emit('error', { error });
      }
    });
  }
}

module.exports = BaseWorker;
