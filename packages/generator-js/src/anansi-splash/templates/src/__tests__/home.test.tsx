import renderer from 'react-test-renderer';
import { mockInitialState } from '@rest-hooks/test';
import ExchangeRatesResource from 'resources/ExchangeRatesResource';

import RootProvider from '../RootProvider';
import Home from '../pages/Home';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <RootProvider
        initialState={mockInitialState([ExchangeRatesResource.fixtures.list])}
      >
        <Home />
      </RootProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
