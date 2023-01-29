import {
  Entity,
  createResource,
  RestEndpoint,
  Schema,
  EndpointExtraOptions,
} from '@rest-hooks/rest';

export abstract class PlaceholderEntity extends Entity {
  readonly id: number = 0;

  // all Resources of `jsonplaceholder` use an id for the primary key
  pk() {
    return `${this.id}`;
  }
}

/** Common patterns in the https://jsonplaceholder.typicode.com API */
export function createPlaceholderResource<U extends string, S extends Schema>({
  path,
  schema,
  Endpoint = RestEndpoint,
  ...rest
}: {
  readonly path: U;
  readonly schema: S;
  readonly Endpoint?: typeof RestEndpoint;
} & EndpointExtraOptions) {
  const base = createResource({
    path,
    schema,
    Endpoint,
    ...rest,
    urlPrefix: 'https://jsonplaceholder.typicode.com',
  });
  const partialUpdate = base.partialUpdate.extend({
    fetch: async function (...args: any) {
      // body only contains what we're changing, but we can find the id in params
      return {
        ...(await base.partialUpdate.call(this, ...args)),
        id: args[0].id,
      } as any;
    },
  });
  return {
    ...base,
    // Endpoint overrides are to compensate for the jsonplaceholder API not returning
    // the correct ID in certain cases
    //
    // This is sometimes needed when you don't control the server API itself
    // More here: https://resthooks.io/docs/guides/network-transform#case-of-the-missing-id
    partialUpdate,
    create: base.create.extend({
      fetch: async function (...args: any) {
        // body only contains what we're changing, but we can find the id in params
        return {
          ...(await base.create.call(this, ...args)),
          id: args[args.length - 1].id,
        } as any;
      },
    }),
  };
}
