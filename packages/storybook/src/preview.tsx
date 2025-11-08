import { DataProvider, AsyncBoundary } from '@data-client/react';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    Story => (
      <DataProvider>
        <AsyncBoundary>
          <Story />
        </AsyncBoundary>
      </DataProvider>
    ),
  ],
};

export default preview;
