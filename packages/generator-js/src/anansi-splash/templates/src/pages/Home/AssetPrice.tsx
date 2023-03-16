import { useLive } from '@rest-hooks/react';
import { getExchangeRates } from 'api/ExchangeRates';

export interface Props {
  symbol: string;
}

/** Shows the current trading price for a given asset */
export default function AssetPrice({ symbol }: Props) {
  // Learn more about Rest Hooks: https://resthooks.io/docs/getting-started/usage
  const { data: price } = useLive(getExchangeRates, {
    currency: 'USD',
  });
  const displayPrice = formatPrice.format(1 / Number.parseFloat(price.rates[symbol]));
  return (
    <span>
      {symbol} {displayPrice}
    </span>
  );
}

const formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
