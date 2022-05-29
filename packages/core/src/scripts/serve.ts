#!/usr/bin/env node

import { promisify } from 'util';
import diskFs from 'fs';
import path from 'path';
import webpack from 'webpack';
import { Server, IncomingMessage, ServerResponse } from 'http';
import express, { NextFunction } from 'express';
import ora from 'ora';
import compress from 'compression';

import 'cross-fetch/polyfill';
import { Render } from './types';

const entrypoint = process.argv[2];
const manifestPath = process.argv[3];
const PORT = process.env.PORT || 8080;

if (!entrypoint || !manifestPath) {
  console.log(
    `Usage: ${process.argv[0]} <server-entrypoint> <client-manifest>`,
  );
  process.exit(-1);
}

const loader = ora('Building the assets').start();

const readFile = promisify(diskFs.readFile);
let server: Server | undefined;

function handleErrors<
  F extends (
    req: Request | IncomingMessage,
    res: Response | ServerResponse,
  ) => Promise<void>,
>(fn: F) {
  return async function (
    req: Request | IncomingMessage,
    res: Response | ServerResponse,
    next: NextFunction,
  ) {
    try {
      return await fn(req, res);
    } catch (x) {
      next(x);
    }
  };
}

// Start the express server after the first compilation
function initializeApp(clientManifest: webpack.StatsCompilation) {
  loader.info('Launching server');
  if (!clientManifest) {
    console.log('Manifest not found');
    // TODO: handle more gracefully
    process.exit(-1);
  }

  const wrappingApp = express();
  // eslint-disable-next-line
  //@ts-ignore
  wrappingApp.use(compress());

  // ASSETS
  const assetRoute = async (req: Request | IncomingMessage, res: any) => {
    const filename =
      req.url?.substr((process.env.WEBPACK_PUBLIC_PATH as string).length) ?? '';
    const assetPath = path.join(clientManifest.outputPath ?? '', filename);

    try {
      const fileContent = (await readFile(assetPath)).toString();
      res.contentType(filename);
      res.send(fileContent);
    } catch (e) {
      res.status(404);
      res.send(e);
      return;
    }
  };
  wrappingApp.get(`${process.env.WEBPACK_PUBLIC_PATH}*`, assetRoute);

  // SERVER SIDE RENDERING
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const render: Render = require(path.join(process.cwd(), entrypoint)).default;
  wrappingApp.get(
    '/*',
    handleErrors(async function (req: any, res: any) {
      if (req.url.endsWith('favicon.ico')) {
        res.statusCode = 404;
        res.setHeader('Content-type', 'text/html');
        res.send('not found');
        return;
      }
      res.socket.on('error', (error: unknown) => {
        console.error('Fatal', error);
      });

      await render(clientManifest, req, res);
    }),
  );

  server = wrappingApp
    .listen(PORT, () => {
      console.log(`Listening at ${PORT}...`);
    })
    .on('error', function (error: any) {
      if (error.syscall !== 'listen') {
        throw error;
      }
      const isPipe = (portOrPipe: string | number) => Number.isNaN(portOrPipe);
      const bind = isPipe(PORT) ? 'Pipe ' + PORT : 'Port ' + PORT;
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
        default:
          throw error;
      }
    });
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
initializeApp(require(path.join(process.cwd(), manifestPath)));

process.on('SIGINT', () => {
  loader.warn('Received SIGINT, devserver shutting down');
  if (server) console.log('Closing server');
  server?.close(() => {
    loader.info('Server closed');
  });
  process.exit(-1);
});
