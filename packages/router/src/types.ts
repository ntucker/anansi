export interface Route<ResolveWith, Match = any> {
  name: string;
  component: React.ComponentType<any> & {
    preload: () => Promise<React.ComponentType>;
  };
  resolveData?: (
    resolveWith: ResolveWith,
    match: Match & Route<ResolveWith, Match>,
    searchParams: URLSearchParams,
  ) => Promise<void>;
}

export type LazyPage<P = any> = React.ComponentType<P> & {
  preload: () => Promise<React.ComponentType<P>>;
};

export interface NetworkError extends Error {
  status: number;
  response?: Response;
}

export interface UnknownError extends Error {
  status?: unknown;
  response?: unknown;
}

export type ErrorTypes = NetworkError | UnknownError;
