const obj = { foo: 'foo' };

// Post data to parent thread
(self as DedicatedWorkerGlobalScope).postMessage({ foo: 'foo' });

// Respond to message from parent thread
self.addEventListener('message', (event: MessageEventInit) =>
  event.data.message.toUpperCase(),
);
