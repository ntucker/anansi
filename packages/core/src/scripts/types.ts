import { ServerResponse, IncomingMessage } from 'http';
import { StatsCompilation } from 'webpack';
import { Request, Response } from 'express';

export type Render = (
  clientManifest: StatsCompilation,
  req: Request | IncomingMessage,
  res: Response | ServerResponse,
) => Promise<void>;
