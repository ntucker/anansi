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
};

/* Baseline expectations of return value */
export type ResolveProps = {
  app: JSX.Element;
};

export type CreateRouter<T> = (
  history: History,
) => RouteController<Route<T, any>>;
