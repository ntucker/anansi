import { Entity } from '@data-client/rest';
import {
  RestEndpoint,
  resource,
  ResourceGenerics,
  ResourceOptions,
  Resource,
} from '@data-client/rest';

export abstract class PlaceholderEntity extends Entity {
  // all Resources of `jsonplaceholder` use an id for the primary key
  id = 0;
}

/** Common patterns in the https://jsonplaceholder.typicode.com API */
export function placeholderResource<O extends ResourceGenerics = any>({
  path,
  schema,
  Endpoint = RestEndpoint,
}: Readonly<O> & ResourceOptions): Resource<O> {
  const base = resource({
    path,
    schema,
    Endpoint,
    urlPrefix: 'https://jsonplaceholder.typicode.com',
    // hour expiry time since we want to keep our example mutations and the api itself never actually changes
    dataExpiryLength: 1000 * 60 * 60,
  });
  const partialUpdate = base.partialUpdate.extend({
    fetch: async function (...args: any) {
      // body only contains what we're changing, but we can find the id in params
      return {
        ...(await base.partialUpdate.call(this, ...args)),
        id: args?.[0]?.id,
      } as any;
    },
  });
  return {
    ...base,
    // Endpoint overrides are to compensate for the jsonplaceholder API not returning
    // the correct ID in certain cases
    //
    // This is sometimes needed when you don't control the server API itself
    // More here: https://dataclient.io/rest/guides/network-transform#case-of-the-missing-id
    partialUpdate,
    create: base.create.extend({
      fetch: async function (...args: any) {
        // body only contains what we're changing, but we can find the id in params
        return {
          ...(await base.create.call(this, ...args)),
          id: args?.[args.length - 1]?.id,
        } as any;
      },
    }),
    // generics don't match up well
  } as any;
}
