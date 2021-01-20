import { Suspense } from 'react';
import { CacheProvider, NetworkErrorBoundary } from 'rest-hooks';
import 'style/main.scss';


export const decorators = [
  (Story) => (
  <CacheProvider>
    <Suspense fallback={'loading'}>
      <NetworkErrorBoundary>
        <Story/>
      </NetworkErrorBoundary>
    </Suspense>
  </CacheProvider>
  )
];

