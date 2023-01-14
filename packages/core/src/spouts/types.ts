import { Route, RouteController } from '@anansi/router';
import { Request, Response } from 'express';
import { History } from 'history';
import { IncomingMessage, ServerResponse } from 'http';
import type { StatsCompilation } from 'webpack';

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
export type ServerSpout<
  NeededProps extends Record<string, unknown> = Record<string, unknown>,
  ProvidedProps extends Record<string, unknown> = Record<string, unknown>,
  NeededNext extends Record<string, unknown> = Record<string, unknown>,
> = <N extends NeededNext & ResolveProps, I extends ServerProps>(
  next: (props: I & ProvidedProps) => Promise<N>,
) => (props: NeededProps & I) => Promise<N & ProvidedProps>;

/* Spouts are middleware for Anansi */
export type ClientSpout<
  NeededProps extends Record<string, unknown> = Record<string, unknown>,
  ProvidedProps extends Record<string, unknown> = Record<string, unknown>,
  NeededNext extends Record<string, unknown> = Record<string, unknown>,
> = <N extends NeededNext & ResolveProps, I>(
  next: (props: I & ProvidedProps) => Promise<N>,
) => (props: NeededProps & I) => Promise<N & ProvidedProps>;
