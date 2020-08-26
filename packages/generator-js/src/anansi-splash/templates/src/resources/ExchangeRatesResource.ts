import { Resource, SimpleResource } from '@rest-hooks/rest';

// Visit https://resthooks.io/docs/guides/resource-types to read more about these definitions
export default class ExchangeRatesResource extends Resource {
  readonly currency: string = 'USD';
  readonly rates: Record<string, string> = {};

  pk(): string {
    return this.currency;
  }

  static urlRoot = 'https://www.coinbase.com/api/v2/exchange-rates';

  static getEndpointExtra() {
    return { pollFrequency: 15000 };
  }

  static list<T extends typeof SimpleResource>(this: T) {
    return super.list().extend({
      schema: { data: this },
    });
  }
}
