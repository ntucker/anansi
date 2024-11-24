import { render } from '@testing-library/react'
import { DataProvider, AsyncBoundary } from '@data-client/react';
import { mockInitialState } from '@data-client/test';

import { TickerFixtures } from '@/resources/Ticker';
import Home from '@/pages/Home';

it('renders correctly', () => {
  const { asFragment } = render(
    <DataProvider initialState={mockInitialState([TickerFixtures.get])}>
      <AsyncBoundary>
        <Home />
      </AsyncBoundary>
    </DataProvider>
  );
  expect(asFragment()).toMatchSnapshot();
});
