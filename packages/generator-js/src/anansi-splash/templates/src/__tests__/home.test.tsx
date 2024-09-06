import renderer from 'react-test-renderer';
import { DataProvider, AsyncBoundary } from '@data-client/react';
import { mockInitialState } from '@data-client/test';

import { TickerFixtures } from '@/resources/Ticker';
import Home from '@/pages/Home';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <DataProvider initialState={mockInitialState([TickerFixtures.list])}>
        <AsyncBoundary>
          <Home />
        </AsyncBoundary>
      </DataProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
