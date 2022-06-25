import { IncomingMessage, ServerResponse } from 'http';
import { Request, Response } from 'express';
import type { StatsCompilation } from 'webpack';
import { History } from 'history';
import { Route, RouteController } from '@anansi/router';

/* Variables from the rendering call */
export type ServerProps = {
  req: Request | IncomingMessage;
  res: Response | ServerResponse;
  clientManifest: StatsCompilation;
  nonce: string;
};

/* Baseline expectations of return value */
export type ResolveProps = {
  app: JSX.Element;
};

export type CreateRouter<T> = (
  history: History,
) => RouteController<Route<T, any>>;

/* Spouts are middleware for Anansi */
export declare type ServerSpout<
  NeededProps = unknown,
  ProvidedProps = unknown,
  NeededNext = unknown,
> = <
  N extends NeededNext & ResolveProps,
  I extends ServerProps & ProvidedProps,
>(
  next: (props: I) => Promise<N>,
) => (
  props: NeededProps & Omit<I, keyof ProvidedProps>,
) => Promise<N & ProvidedProps>;

/* Spouts are middleware for Anansi */
export declare type ClientSpout<
  NeededProps = unknown,
  ProvidedProps = unknown,
  NeededNext = unknown,
> = <N extends NeededNext & ResolveProps, I extends ProvidedProps>(
  next: (props: I) => Promise<N>,
) => (
  props: NeededProps & Omit<I, keyof ProvidedProps>,
) => Promise<N & ProvidedProps>;
