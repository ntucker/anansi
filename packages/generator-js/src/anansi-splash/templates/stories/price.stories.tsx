import { type StoryObj } from '@storybook/react';
import { MockResolver } from '@data-client/test';
import { TickerFixtures } from 'resources/Ticker';

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
      options: Object.keys(TickerFixtures.list.response.data.rates),
      control: {
        type: 'select',
      },
    },
  },
};

export const BTCPrice: StoryObj<typeof Price> = {
  render: args => (
    <MockResolver fixtures={[TickerFixtures.list]}>
      <Price {...args} />
    </MockResolver>
  ),
  args: { symbol: 'BTC' }
}
