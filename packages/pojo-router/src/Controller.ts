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
          // `??` (not a spread default) so `decode: undefined` still gets safeDecode
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
    // empty values count as missing: optional groups are omitted and required
    // params throw (as path-to-regexp v6 did) rather than building a path that
    // can't match
    if (Array.isArray(v)) {
      const segments = v.filter(isPresent).map(String);
      if (segments.length) params[k] = segments;
    } else if (isPresent(v)) {
      params[k] = String(v);
    }
  }
  return params;
}

function isPresent(v: unknown) {
  return v != null && v !== '';
}

// malformed escapes (e.g. `/post/%E0%A4%A`) keep their raw value instead of throwing
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
