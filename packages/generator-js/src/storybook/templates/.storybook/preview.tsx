<% if (spa) { %>
import RootProvider from '../src/RootProvider'
<% } else { %>
  import { Suspense } from 'react';
  import { CacheProvider, NetworkErrorBoundary } from 'rest-hooks';
<% } %>
import 'style/main.scss';


export const decorators = [
  (Story) => (
<% if (spa) { %>
  <RootProvider>
<% } else { %>
  <CacheProvider>
    <Suspense fallback={'loading'}>
      <NetworkErrorBoundary>
<% } %>
        <Story/>
<% if (spa) { %>
  </RootProvider>
<% } else { %>
      </NetworkErrorBoundary>
    </Suspense>
  </CacheProvider>
<% } %>
  )
];

