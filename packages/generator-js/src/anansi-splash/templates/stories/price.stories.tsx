import { Story } from '@storybook/react/types-6-0';
import { MockResolver } from '@rest-hooks/test';
import { ExchangeRatesFixtures } from 'resources/ExchangeRatesResource';

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
      control: {
        type: 'select',
        options: Object.keys(
          ExchangeRatesFixtures.list.response.data.rates,
        ),
      },
    },
  },
};

const Template: Story<{ symbol: string }> = args => (
  <MockResolver fixtures={[ExchangeRatesFixtures.list]}>
    <Price {...args} />
  </MockResolver>
);

export const BTCPrice = Template.bind({});

BTCPrice.args = {
  symbol: 'BTC',
};
