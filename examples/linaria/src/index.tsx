import ReactDOM from 'react-dom';

import loadPolyfills from '@anansi/polyfill';

import App from './App';

async function init() {
  await loadPolyfills();
}
init();
ReactDOM.render(<App />, document.body);
