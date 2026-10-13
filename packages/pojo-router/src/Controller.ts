import type { History } from 'history';
import { match as matchPath, compile, parse } from 'path-to-regexp';
import type { MatchFunction, ParamData, PathFunction } from 'path-to-regexp';

import type {
  AnyIfEmpty,
  BuildPathArgs,
  DefaultRoutePojo,
  NamedPath,
  NamedPaths,
} from './types.js';

export interface ControllerProps<
  Route extends { name: string } = {
    name: string;
  },
  Paths extends NamedPaths = any,
> {
  history: History;
  namedPaths: Paths;
  routes: readonly Route[];
  notFound: AnyIfEmpty<DefaultRoutePojo>;
}

export default class RouteController<
  Route extends { name: string } = { name: string },
  Paths extends NamedPaths = any,
> {
  // cache for match lookups. Reset if routes ever change.
  // could make this LRU if it takes up too much space.
  private cachedMatches: Record<string, any> = {};
  declare private normalizedRouter: {
    pathOrPathName: string;
    route: any;
    matcher: MatchFunction<ParamData>;
    outboundPath: PathFunction<object>;
  }[];

  declare readonly history: History;
  declare readonly notFound: AnyIfEmpty<DefaultRoutePojo>;
  declare readonly pathBuilders: Record<string, PathFunction<object>>;

  constructor({
    history,
    namedPaths,
    routes,
    notFound,
  }: ControllerProps<Route, Paths>) {
    this.history = history;
    this.notFound = notFound;
    this.normalizedRouter = routes.map(route => {
      const pathOrPathName = route.name;
      const pathObjectOrString =
        pathOrPathName in namedPaths ?
          namedPaths[pathOrPathName]
        : pathOrPathName;
      const { path, ...options } =
        typeof pathObjectOrString === 'string' ?
          { path: pathObjectOrString as string }
        : (pathObjectOrString as NamedPath);
      const parsed = parse(path, options);
      const build = compile(parsed, options);
      return {
        pathOrPathName,
        route,
        matcher: matchPath(parsed, {
          ...options,
          // undefined means safeDecode, not path-to-regexp's throwing decodeURIComponent
          decode: options.decode ?? safeDecode,
        }),
        outboundPath: (data?: object) =>
          build(data ? stringifyParams(data) : undefined),
      };
    });

    this.pathBuilders = this.normalizedRouter.reduce(
      (acc, { pathOrPathName, outboundPath }) => ({
        ...acc,
        [pathOrPathName]: outboundPath,
      }),
      {},
    );
  }

  getMatchedRoutes(pathToMatch: string): (Route & object)[] {
    if (pathToMatch in this.cachedMatches) {
      return this.cachedMatches[pathToMatch];
    }

    const allMatches = this.normalizedRouter.reduce(
      (
        acc: Record<string, any>[],
        { matcher, route },
      ): Record<string, any>[] => {
        const match = matcher(pathToMatch);
        const params = match && match.params ? match.params : {};
        return match ? [...acc, { ...route, ...params }] : acc;
      },
      [],
    );

    const matches = allMatches.length === 0 ? [this.notFound] : allMatches;
    this.cachedMatches[pathToMatch] = matches;

    return matches;
  }

  buildPath<N extends string>(
    pathOrPathName: N,
    ...[pathData]: BuildPathArgs<Paths, N>
  ): string {
    if (
      !Object.prototype.hasOwnProperty.call(this.pathBuilders, pathOrPathName)
    )
      throw new Error(`Unknown route: ${pathOrPathName}`);
    return this.pathBuilders[pathOrPathName](pathData as object | undefined);
  }
}

// path-to-regexp only accepts strings, but ids are often numbers
function stringifyParams(pathData: object): ParamData {
  const params: ParamData = {};
  for (const [k, v] of Object.entries(pathData)) {
    // empty wildcards count as missing so optional groups are omitted
    if (v == null || (Array.isArray(v) && !v.length)) continue;
    params[k] = Array.isArray(v) ? v.map(String) : String(v);
  }
  return params;
}

// malformed escapes (e.g. `/post/%E0%A4%A`) keep their raw value instead of throwing
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
