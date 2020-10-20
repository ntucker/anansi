import { unstable_createRoot as createRoot } from 'react-dom';
import 'style/main.scss';

import React from 'react';
import NetworkBoundary from 'components/NetworkBoundary';

import Provider from './Provider';
import App from './App';

createRoot(document.body /*, { hydrate: true }*/).render(
  <Provider>
    <NetworkBoundary>
      <App />
    </NetworkBoundary>
  </Provider>,
);
