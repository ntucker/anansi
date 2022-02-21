export interface Route<ResolveWith, Match = any> {
  name: string;
  component: React.ComponentType<any> & {
    preload: () => Promise<React.ComponentType>;
  };
  resolveData?: (
    resolveWith: ResolveWith,
    match: Match & Route<ResolveWith, Match>,
  ) => Promise<void>;
}

export type LazyPage<P = any> = React.ComponentType<P> & {
  preload: () => Promise<React.ComponentType<P>>;
};
