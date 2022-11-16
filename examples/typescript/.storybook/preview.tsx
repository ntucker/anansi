import { MemoryRouter } from 'react-router-dom';
import { AsyncBoundary, CacheProvider, NetworkManager } from '@rest-hooks/react';
import 'style/main.scss';


const managers = [new NetworkManager()]
export const decorators = [
  (Story) => (
  <CacheProvider managers={managers}>
    <MemoryRouter initialEntries={['/']}>
      <AsyncBoundary fallback={'loading'}>
        <Story/>
      </AsyncBoundary>
    </MemoryRouter>
  </CacheProvider>
  )
];

