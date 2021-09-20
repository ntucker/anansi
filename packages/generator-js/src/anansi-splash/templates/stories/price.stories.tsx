import { Story } from '@storybook/react/types-6-0';
import { MockResolver } from '@rest-hooks/test';
import ExchangeRatesResource from 'resources/ExchangeRatesResource';

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
          ExchangeRatesResource.fixtures.list.response.data.rates,
        ),
      },
    },
  },
};

const Template: Story<{ symbol: string }> = args => (
  <MockResolver fixtures={[ExchangeRatesResource.fixtures.list]}>
    <Price {...args} />
  </MockResolver>
);

export const BTCPrice = Template.bind({});

BTCPrice.args = {
  symbol: 'BTC',
};
