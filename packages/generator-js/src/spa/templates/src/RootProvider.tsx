import type { ReactNode } from 'react';
import { CacheProvider } from 'rest-hooks';

import Boundary from './Boundary';

export default function RootProvider({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <Boundary>{children}</Boundary>
    </CacheProvider>
  );
}
