import { render, screen } from '@testing-library/react';
import React from 'react';

import Home from '../index';

it('renders correctly', () => {
  const { asFragment } = render(<Home />);

  expect(asFragment()).toMatchSnapshot();
});
