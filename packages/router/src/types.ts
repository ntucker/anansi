export interface Route<ResolveWith, Match = any> {
  component: React.ComponentType<any> & {
    preload: () => Promise<React.ComponentType>;
  };
  resolveData?: (
    resolveWith: ResolveWith,
    match: Match & Route<ResolveWith, Match>,
  ) => Promise<void>;
}
export type LazyPage = React.ComponentType<any> & {
  preload: () => Promise<React.ComponentType>;
};
