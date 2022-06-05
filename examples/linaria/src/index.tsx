import ReactDOM from 'react-dom/client';
import loadPolyfills from '@anansi/polyfill';

import App from './App';

async function init() {
  await loadPolyfills();
}
init();
ReactDOM.createRoot(document.body).render(<App />);
