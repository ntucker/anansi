import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CacheProvider, NetworkManager } from '@rest-hooks/core';
import { NetworkErrorBoundary } from 'rest-hooks';
import 'style/main.scss';


const managers = [new NetworkManager()]
export const decorators = [
  (Story) => (
  <CacheProvider managers={managers}>
    <MemoryRouter initialEntries={['/']}>
      <Suspense fallback={'loading'}>
        <NetworkErrorBoundary>
          <Story/>
        </NetworkErrorBoundary>
      </Suspense>
    </MemoryRouter>
  </CacheProvider>
  )
];

