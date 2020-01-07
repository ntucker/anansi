import { Resource, SimpleResource } from 'rest-hooks';

// Visit https://resthooks.io/docs/guides/resource-types to read more about these definitions
export default class ExchangeRatesResource extends Resource {
  readonly currency: string = 'USD';
  readonly rates: Record<string, string> = {};

  pk(): string {
    return this.currency;
  }

  static urlRoot = 'https://www.coinbase.com/api/v2/exchange-rates';

  static getFetchOptions() {
    return { pollFrequency: 15000 };
  }

  static listShape<T extends typeof SimpleResource>(this: T) {
    return {
      ...super.listShape(),
      schema: { data: this.getEntitySchema() },
    };
  }
}
