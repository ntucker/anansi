import { useLive } from '@data-client/react';
import { getTicker } from 'resources/Ticker';

/** Shows the current trading price for a given asset */
export default function AssetPrice({ symbol }: Props) {
  const product_id = `${symbol}-USD`
  // Learn more about Reactive Data Client: https://dataclient.io/docs
  const ticker = useLive(getTicker, { product_id });
  const displayPrice = formatPrice.format(ticker.price);
  return (
    <span>
      {symbol} {displayPrice}
    </span>
  );
}
export interface Props {
  symbol: string;
}

const formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
