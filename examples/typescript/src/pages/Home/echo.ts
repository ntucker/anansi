/// <reference lib="webworker" />

// Post data to parent thread
self.postMessage({ foo: 'foo' });

// Respond to message from parent thread
self.addEventListener('message', (event: MessageEventInit) =>
  console.log(event.data.message.toUpperCase()),
);
