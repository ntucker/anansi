import React, { useMemo, useContext } from 'react';
import { match as matchPath, compile } from 'path-to-regexp';
import type {
  ParseOptions,
  TokensToRegexpOptions,
  RegexpToFunctionOptions,
} from 'path-to-regexp';

// We want to allow re-declaration of this by declaration merging,
// but assume types if not defined

// styled-components uses this to have theme defined.
// https://styled-components.com/docs/api#create-a-declarations-file
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DefaultRoutePojo {}

type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;

const thrower = () => {
  throw new Error('context not set');
};
export const InboundRouterContext = React.createContext(
  thrower as (v: string) => AnyIfEmpty<DefaultRoutePojo>[],
);
const OutboundRouterContext = React.createContext({} as Record<string, any>);
const CurrentPathContext = React.createContext('');

type NamedPath = { path: string } & ParseOptions &
  TokensToRegexpOptions &
  RegexpToFunctionOptions;
type Route = readonly [string, AnyIfEmpty<DefaultRoutePojo>];
type Props = {
  children: React.ReactNode;
  namedPaths: Record<string, string | NamedPath>;
  routes: readonly Route[];
  notFound: AnyIfEmpty<DefaultRoutePojo>;
  currentPath: string;
};

const PojoRouter = ({
  children,
  namedPaths,
  routes,
  notFound,
  currentPath,
}: Props) => {
  const normalizedRouter = useMemo(
    () =>
      routes.map(([pathOrPathName, values]) => {
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
      }),
    [namedPaths, routes],
  );

  const outboundRouter = useMemo(
    () =>
      normalizedRouter.reduce(
        (acc, { pathOrPathName, outboundPath }) => ({
          ...acc,
          [pathOrPathName]: outboundPath,
        }),
        {},
      ),
    [normalizedRouter],
  );

  const allMatches = useMemo(() => {
    // cache for match lookups. Reset if routes ever change.
    // could make this LRU if it takes up too much space.
    const cachedMatches: Record<string, any> = {};

    return (pathToMatch: string) => {
      if (pathToMatch in cachedMatches) {
        return cachedMatches[pathToMatch];
      }

      const allMatches = normalizedRouter.reduce(
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

      const matches = allMatches.length === 0 ? [notFound] : allMatches;
      cachedMatches[pathToMatch] = matches;

      return matches;
    };
  }, [normalizedRouter, notFound]);

  return (
    <InboundRouterContext.Provider value={allMatches}>
      <OutboundRouterContext.Provider value={outboundRouter}>
        <CurrentPathContext.Provider value={currentPath}>
          {children}
        </CurrentPathContext.Provider>
      </OutboundRouterContext.Provider>
    </InboundRouterContext.Provider>
  );
};
PojoRouter.defaultValues = {
  namedPaths: {},
};

export const useCurrentPath = () => {
  return useContext(CurrentPathContext);
};

export const useMatches = (pathToMatch: string) => {
  const allMatches = useContext(InboundRouterContext);
  return allMatches(pathToMatch);
};

export const useMatchFinder = () => useContext(InboundRouterContext);

export const useFirstMatch = (pathToMatch: string) =>
  useMatches(pathToMatch)[0];

export const useBestMatch = (
  pathToMatch: string,
  matchComparator: (s1: string, s2: string) => number,
) => {
  const allMatches = useMatches(pathToMatch);
  allMatches.sort(matchComparator);
  return allMatches[0];
};

export const useCurrentMatch = () => useFirstMatch(useCurrentPath());

export const useOutboundRoute = (pathOrPathName: string) => {
  const allRoutes = useContext(OutboundRouterContext);
  const outboundRoute = allRoutes[pathOrPathName];

  if (!outboundRoute) {
    throw new Error(`Unknown route: ${pathOrPathName}`);
  }

  return outboundRoute;
};

export default PojoRouter;
