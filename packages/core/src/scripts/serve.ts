#!/usr/bin/env node

import { promisify } from 'util';
import diskFs from 'fs';
import path from 'path';
import webpack, { web } from 'webpack';
import { Server, IncomingMessage, ServerResponse } from 'http';
import express, { NextFunction } from 'express';
import ora from 'ora';
import compress from 'compression';

import 'cross-fetch/polyfill';
import { Render } from './types';

// run directly from node
if (require.main === module) {
  const entrypoint = process.argv[2];

  if (!entrypoint) {
    console.log(`Usage: ${process.argv[0]} <server-entrypoint>`);
    process.exit(-1);
  }
  serve(entrypoint);
}

export default function serve(
  entrypoint: string,
  options: { serveAssets?: boolean } = {},
) {
  const PORT = process.env.PORT || 8080;

  const loader = ora('Initializing').start();

  const manifestPath = getManifestPathFromWebpackconfig();

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
      loader.fail('Manifest not found');
      // TODO: handle more gracefully
      process.exit(-1);
    }

    const wrappingApp = express();
    // eslint-disable-next-line
    //@ts-ignore
    wrappingApp.use(compress());

    // SERVER SIDE RENDERING
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const render: Render = require(path.join(
      process.cwd(),
      entrypoint,
    )).default;
    const handlers = [
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
    ];

    // ASSETS
    if (options.serveAssets) {
      handlers.unshift(
        async (
          req: Request | IncomingMessage,
          res: any,
          next: NextFunction,
        ) => {
          const filename =
            req.url?.substr(
              (process.env.WEBPACK_PUBLIC_PATH as string).length,
            ) ?? '';
          const assetPath = path.join(
            clientManifest.outputPath ?? '',
            filename,
          );

          if (
            diskFs.existsSync(assetPath) &&
            !diskFs.lstatSync(assetPath).isDirectory()
          ) {
            try {
              const fileContent = (await readFile(assetPath)).toString();
              res.contentType(filename);
              res.send(fileContent);
            } catch (e) {
              return next(e);
            }
          } else {
            next();
          }
        },
      );
    }

    wrappingApp.get('/*', ...handlers);

    server = wrappingApp
      .listen(PORT, () => {
        loader.info(`Listening at ${PORT}...`);
      })
      .on('error', function (error: any) {
        if (error.syscall !== 'listen') {
          throw error;
        }
        const isPipe = (portOrPipe: string | number) =>
          Number.isNaN(portOrPipe);
        const bind = isPipe(PORT) ? 'Pipe ' + PORT : 'Port ' + PORT;
        switch (error.code) {
          case 'EACCES':
            loader.fail(bind + ' requires elevated privileges');
            process.exit(1);
          // eslint-disable-next-line no-fallthrough
          case 'EADDRINUSE':
            loader.fail(bind + ' is already in use');
            process.exit(1);
          // eslint-disable-next-line no-fallthrough
          default:
            throw error;
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  initializeApp(require(manifestPath));

  process.on('SIGINT', () => {
    loader.warn('Received SIGINT, devserver shutting down');
    if (server) console.log('Closing server');
    server?.close(() => {
      loader.info('Server closed');
    });
    process.exit(-1);
  });
}

function getManifestPathFromWebpackconfig() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const webpackConfig: webpack.Configuration = require(require.resolve(
    // TODO: use normal resolution algorithm to find webpack file
    path.join(process.cwd(), 'webpack.config'),
  ))({}, { mode: 'production' });
  const manifestFilename: string =
    (
      webpackConfig?.plugins?.find(plugin => {
        return plugin.constructor.name === 'StatsWriterPlugin';
      }) as any
    )?.opts?.filename ?? 'manifest.json';

  const manifestPath = path.join(
    webpackConfig?.output?.path ?? '',
    manifestFilename,
  );
  return manifestPath;
}
