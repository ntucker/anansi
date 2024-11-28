import type { History } from 'history';
import { match as matchPath, compile } from 'path-to-regexp';
import type { MatchFunction, PathFunction } from 'path-to-regexp';

import type { AnyIfEmpty, DefaultRoutePojo, NamedPath } from './types.js';

export interface ControllerProps<
  Route extends { name: string } = {
    name: string;
  },
> {
  history: History;
  namedPaths: Record<string, string | NamedPath>;
  routes: readonly Route[];
  notFound: AnyIfEmpty<DefaultRoutePojo>;
}

export default class RouteController<
  Route extends { name: string } = { name: string },
> {
  // cache for match lookups. Reset if routes ever change.
  // could make this LRU if it takes up too much space.
  private cachedMatches: Record<string, any> = {};
  declare private normalizedRouter: {
    pathOrPathName: string;
    route: any;
    matcher: MatchFunction<object>;
    outboundPath: PathFunction<object>;
  }[];

  declare readonly history: History;
  declare readonly notFound: AnyIfEmpty<DefaultRoutePojo>;
  declare readonly pathBuilders: Record<string, PathFunction>;

  constructor({
    history,
    namedPaths,
    routes,
    notFound,
  }: ControllerProps<Route>) {
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
      return {
        pathOrPathName,
        route,
        matcher: matchPath(path, options),
        outboundPath: compile(path, options),
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

  buildPath(pathOrPathName: string, pathData?: object): string {
    if (
      !Object.prototype.hasOwnProperty.call(this.pathBuilders, pathOrPathName)
    )
      throw new Error(`Unknown route: ${pathOrPathName}`);
    return this.pathBuilders[pathOrPathName](pathData);
  }
}
