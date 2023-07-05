import { CacheProvider, AsyncBoundary } from '@data-client/react';

export const decorators = [
  (Story: React.FC) => (
    <CacheProvider>
      <AsyncBoundary>
        <Story />
      </AsyncBoundary>
    </CacheProvider>
  ),
];
