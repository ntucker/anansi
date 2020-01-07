import React, { Suspense } from 'react';
import { CacheProvider } from 'rest-hooks';

export default function RootProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  return (
    <CacheProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </CacheProvider>
  );
}
