import { Request, Response } from 'express';
import { ServerResponse, IncomingMessage } from 'http';
import { StatsCompilation } from 'webpack';

export type Render = (
  clientManifest: StatsCompilation,
  req: Request | IncomingMessage,
  res: Response | ServerResponse,
) => Promise<void>;

export type BoundRender = (
  req: Request | IncomingMessage,
  res: Response | ServerResponse,
) => Promise<void>;
