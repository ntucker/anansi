import { DataProvider, AsyncBoundary } from '@data-client/react';

export const decorators = [
  (Story: React.FC) => (
    <DataProvider>
      <AsyncBoundary>
        <Story />
      </AsyncBoundary>
    </DataProvider>
  ),
];
