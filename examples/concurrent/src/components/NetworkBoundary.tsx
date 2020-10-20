import React, { memo, Suspense } from 'react';
import { NetworkErrorBoundary } from 'rest-hooks';

function NetworkBoundary({ children }: { children: React.ReactChild }) {
  return (
    <Suspense fallback={'loading'}>
      <NetworkErrorBoundary>{children}</NetworkErrorBoundary>
    </Suspense>
  );
}
export default memo(NetworkBoundary);
