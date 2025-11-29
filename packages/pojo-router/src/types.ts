import type {
  ParseOptions,
  TokensToRegexpOptions,
  RegexpToFunctionOptions,
} from 'path-to-regexp';

// We want to allow re-declaration of this by declaration merging,
// but assume types if not defined

// styled-components uses this to have theme defined.
// https://styled-components.com/docs/api#create-a-declarations-file

export interface DefaultRoutePojo {}

export type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;

export type NamedPath = { path: string } & ParseOptions &
  TokensToRegexpOptions &
  RegexpToFunctionOptions;
