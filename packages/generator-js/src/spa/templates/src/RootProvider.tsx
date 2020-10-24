import { Suspense } from 'react';
import type { ReactChild } from 'react';
import { CacheProvider } from 'rest-hooks';

export default function RootProvider({ children }: { children: ReactChild }) {
  return (
    <CacheProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </CacheProvider>
  );
}
