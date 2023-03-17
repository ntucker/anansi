import { CacheProvider, AsyncBoundary } from '@rest-hooks/react';

export const decorators = [
  (Story: React.FC) => (
    <CacheProvider>
      <AsyncBoundary>
        <Story />
      </AsyncBoundary>
    </CacheProvider>
  ),
];
