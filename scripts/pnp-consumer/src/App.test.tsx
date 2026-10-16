import { act } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

it('renders', async () => {
  const container = document.createElement('div');
  await act(() => createRoot(container).render(<App name="PnP" />));
  expect(container.textContent).toBe('Hello PnP 1');
});
