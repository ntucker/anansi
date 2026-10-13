import type {
  CompileOptions,
  MatchOptions,
  ParseOptions,
} from 'path-to-regexp';

import type { PathArgs } from './pathTypes.js';

export type { PathArgs } from './pathTypes.js';

// We want to allow re-declaration of this by declaration merging,
// but assume types if not defined

// styled-components uses this to have theme defined.
// https://styled-components.com/docs/api#create-a-declarations-file

export interface DefaultRoutePojo {}

export type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;

export type NamedPath = { path: string } & ParseOptions &
  MatchOptions &
  CompileOptions;

export type NamedPaths = Record<string, string | NamedPath>;

type PathOf<Paths extends NamedPaths, Name extends string> =
  Name extends keyof Paths ?
    Paths[Name] extends { path: infer P extends string } ?
      P
    : Paths[Name] & string
  : Name;

/** Params `buildPath()` takes for a route name (or a raw path) */
export type RouteParams<Paths extends NamedPaths, Name extends string> =
  string extends PathOf<Paths, Name> ? any : PathArgs<PathOf<Paths, Name>>;
