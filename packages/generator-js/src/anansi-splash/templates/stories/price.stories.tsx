import { type StoryObj } from '@storybook/react';
import { MockResolver } from '@rest-hooks/test';
import { ExchangeRatesFixtures } from 'api/ExchangeRates';

import Price from './AssetPrice';

export default {
  title: 'atoms/Price',
  component: Price,
  argTypes: {
    symbol: {
      description: 'Asset Symbol',
      defaultValue: {
        symbol: 'BTC',
      },
      options: Object.keys(ExchangeRatesFixtures.list.response.data.rates),
      control: {
        type: 'select',
      },
    },
  },
};

export const BTCPrice: StoryObj<typeof Price> = {
  render: args => (
    <MockResolver fixtures={[ExchangeRatesFixtures.list]}>
      <Price {...args} />
    </MockResolver>
  ),
  args: { symbol: 'BTC' }
}
