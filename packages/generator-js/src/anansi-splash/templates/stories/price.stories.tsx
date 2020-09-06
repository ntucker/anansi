import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { MockProvider } from '@rest-hooks/test';

import priceFixture from './price.fixture';
import Price from './AssetPrice';

export default {
  title: 'atoms/Price',
  component: Price,
  decorators: [
    Story => (
      <MockProvider results={priceFixture}>
        <Story />
      </MockProvider>
    ),
  ],
  argTypes: {
    symbol: {
      description: 'Asset Symbol',
      defaultValue: {
        summary: 'BTC',
      },
      control: {
        type: 'select',
        options: Object.keys(priceFixture[0].result.data.rates),
      },
    },
  },
};

const Template: Story<{ symbol: string }> = args => <Price {...args} />;

export const BTCPrice = Template.bind({});

BTCPrice.args = {
  symbol: 'BTC',
};
