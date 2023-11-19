import renderer from 'react-test-renderer';
import { mockInitialState } from '@data-client/test';
import { ExchangeRatesFixtures } from 'resources/ExchangeRates';

import RootProvider from '../RootProvider';
import Home from '../pages/Home';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <RootProvider
        initialState={mockInitialState([ExchangeRatesFixtures.list])}
      >
        <Home />
      </RootProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
