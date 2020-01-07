import React from 'react';
import { useResource, useSubscription } from 'rest-hooks';

import ExchangeRatesResource from 'resources/ExchangeRatesResource';

export default function BTCPrice() {
  // Learn more about Rest Hooks: https://resthooks.io/docs/getting-started/usage
  const { data: price } = useResource(ExchangeRatesResource.listShape(), {
    currency: 'USD',
  });
  // https://resthooks.io/docs/api/useSubscription
  useSubscription(ExchangeRatesResource.listShape(), {
    currency: 'USD',
  });
  const displayPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(1 / Number.parseFloat(price.rates.BTC));
  return <div>BTC {displayPrice}</div>;
}
