import { Story } from '@storybook/react/types-6-0';
import { MockResolver } from '@rest-hooks/test';

import priceFixture from './price.fixture';
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
        options: Object.keys(priceFixture[0].result.data.rates),
      },
    },
  },
};

const Template: Story<{ symbol: string }> = args => (
  <MockResolver fixtures={priceFixture}>
    <Price {...args} />
  </MockResolver>
);

export const BTCPrice = Template.bind({});

BTCPrice.args = {
  symbol: 'BTC',
};
