import { match as matchPath, compile } from 'path-to-regexp';
import type { MatchFunction, PathFunction } from 'path-to-regexp';

import type { AnyIfEmpty, DefaultRoutePojo, NamedPath, Route } from './types';

type Props = {
  namedPaths: Record<string, string | NamedPath>;
  routes: readonly Route[];
  notFound: AnyIfEmpty<DefaultRoutePojo>;
};

export default class RouteController {
  // cache for match lookups. Reset if routes ever change.
  // could make this LRU if it takes up too much space.
  private cachedMatches: Record<string, any> = {};
  private declare normalizedRouter: {
    pathOrPathName: string;
    values: any;
    matcher: MatchFunction<object>;
    outboundPath: PathFunction<object>;
  }[];

  declare readonly notFound: AnyIfEmpty<DefaultRoutePojo>;
  declare readonly pathBuilders: Record<string, PathFunction>;

  constructor({ namedPaths, routes, notFound }: Props) {
    this.notFound = notFound;
    this.normalizedRouter = routes.map(([pathOrPathName, values]) => {
      const pathObjectOrString =
        pathOrPathName in namedPaths
          ? namedPaths[pathOrPathName]
          : pathOrPathName;
      const { path, ...options } =
        typeof pathObjectOrString === 'string'
          ? { path: pathObjectOrString as string }
          : (pathObjectOrString as NamedPath);
      return {
        pathOrPathName,
        values,
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

  getMatchedRoutes(pathToMatch: string) {
    if (pathToMatch in this.cachedMatches) {
      return this.cachedMatches[pathToMatch];
    }

    const allMatches = this.normalizedRouter.reduce(
      (
        acc: Record<string, any>[],
        { matcher, values },
      ): Record<string, any>[] => {
        const match = matcher(pathToMatch);
        const params = match && match.params ? match.params : {};
        return match ? [...acc, { ...values, ...params }] : acc;
      },
      [],
    );

    const matches = allMatches.length === 0 ? [this.notFound] : allMatches;
    this.cachedMatches[pathToMatch] = matches;

    return matches;
  }

  buildPath(pathOrPathName: string, pathData?: object) {
    if (
      !Object.prototype.hasOwnProperty.call(this.pathBuilders, pathOrPathName)
    )
      throw new Error(`Unknown route: ${pathOrPathName}`);
    this.pathBuilders[pathOrPathName](pathData);
  }
}
