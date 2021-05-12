import renderer from 'react-test-renderer';
import { mockInitialState } from '@rest-hooks/test';
import { listMock } from 'resources/ExchangeRatesResource';

import RootProvider from '../RootProvider';
import Home from '../pages/Home';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <RootProvider initialState={mockInitialState(listMock)}>
        <Home />
      </RootProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
