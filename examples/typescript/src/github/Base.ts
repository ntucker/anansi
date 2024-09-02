import { GQLEndpoint } from '@data-client/graphql';
import {
  Entity,
  Schema,
  ShortenPath,
  schema,
  GetEndpoint,
  RestGenerics,
  RestEndpoint,
  Resource,
  createResource,
  ResourceGenerics,
  ResourceOptions,
  PaginationFieldEndpoint,
} from '@data-client/rest';
import { camelCase, snakeCase } from 'lodash';

import { getAuth } from './Auth';

const HOST = 'https://api.github.com';

export class GithubEntity extends Entity {
  readonly id: number = -1;
}

export const GithubGqlEndpoint = new GQLEndpoint(
  'https://api.github.com/graphql',
  {
    getHeaders(headers: HeadersInit): HeadersInit {
      if (getAuth()) {
        return {
          ...headers,
          Authorization: 'Basic ' + getAuth(),
        };
      }
      return headers;
    },
  },
);

/** Impelements the common functionality for all Resources we'll make */
export class GithubEndpoint<
  O extends RestGenerics = any,
> extends RestEndpoint<O> {
  urlPrefix = HOST;

  async getRequestInit(body: any) {
    let init: RequestInit;
    if (body) {
      init = await super.getRequestInit(
        deeplyApplyKeyTransform(body, snakeCase),
      );
    }
    init = await super.getRequestInit(body);
    if (getAuth()) {
      init.mode = 'cors';
      init.headers = {
        ...init.headers,
        Authorization: 'Basic ' + getAuth(),
      };
    }
    return init;
  }

  async parseResponse(response: Response) {
    const results = await super.parseResponse(response);
    if (
      (response.headers && response.headers.has('link')) ||
      Array.isArray(results)
    ) {
      return {
        link: response.headers.get('link'),
        results,
      };
    }
    return results;
  }

  process(value: any, ...args: any) {
    return deeplyApplyKeyTransform(value, camelCase);
  }
}

export function createGithubResource<O extends ResourceGenerics>(
  options: Readonly<O> & ResourceOptions,
): GithubResource<O> {
  const baseResource = createResource({ Endpoint: GithubEndpoint, ...options });

  const getList: GetEndpoint<
    Omit<O, 'schema' | 'body' | 'path'> & {
      readonly path: ShortenPath<O['path']>;
      readonly schema: {
        results: schema.Collection<O['schema'][]>;
        link: string;
      };
    }
  > = baseResource.getList.extend({
    schema: { results: baseResource.getList.schema, link: '' },
  }) as any;
  const getNextPage = getList.paginated('page');

  return {
    ...baseResource,
    getList,
    getNextPage,
  } as any;
}

export interface GithubResource<
  O extends ResourceGenerics = { path: string; schema: Schema },
> extends Omit<Resource<O>, 'getList' | 'getNextPage'> {
  getList: GetEndpoint<
    Omit<O, 'schema' | 'body' | 'path'> & {
      readonly path: ShortenPath<O['path']>;
      readonly schema: {
        results: schema.Collection<O['schema'][]>;
        link: string;
      };
    }
  >;
  getNextPage: PaginationFieldEndpoint<
    GetEndpoint<
      Omit<O, 'body' | 'schema' | 'path'> & {
        readonly path: ShortenPath<O['path']>;
        readonly schema: {
          results: schema.Collection<O['schema'][]>;
          link: string;
        };
      }
    >,
    'page'
  >;
}

function deeplyApplyKeyTransform(obj: any, transform: (key: string) => string) {
  const ret: any = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach(key => {
    if (obj[key] != null && typeof obj[key] === 'object') {
      ret[transform(key)] = deeplyApplyKeyTransform(obj[key], transform);
    } else {
      ret[transform(key)] = obj[key];
    }
  });
  return ret;
}
