#!/usr/bin/env node
Object.hasOwn =
  Object.hasOwn ||
  /* istanbul ignore next */ function hasOwn(it, key) {
    return Object.prototype.hasOwnProperty.call(it, key);
  };
import compress from 'compression';
import express, { NextFunction } from 'express';
import diskFs from 'fs';
import { Server, IncomingMessage, ServerResponse } from 'http';
import ora from 'ora';
import path from 'path';
import { promisify } from 'util';
import webpack from 'webpack';

import 'cross-fetch/dist/node-polyfill';
import getProxyMiddlewares from './getProxyMiddlewares.js';
import { Render } from './types.js';

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
  options: { serveAssets?: boolean; serveProxy?: boolean } = {},
) {
  const PORT = process.env.PORT || 8080;

  const loader = ora('Initializing').start();

  const webpackConfig: (
    env: any,
    argv: any,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  ) => webpack.Configuration = require(require.resolve(
    // TODO: use normal resolution algorithm to find webpack file
    path.join(process.cwd(), 'webpack.config'),
  ));

  const manifestPath = getManifestPathFromWebpackconfig(
    webpackConfig({}, { mode: 'production' }),
  );

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

    // ASSETS
    if (options.serveAssets) {
      wrappingApp.use(
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
              return next();
            }
          } else {
            next();
          }
        },
      );
    }

    // PROXIES
    if (options.serveProxy) {
      const devConfig: webpack.Configuration = webpackConfig(
        {},
        { mode: 'development' },
      );
      if (devConfig.devServer?.proxy) {
        const middlewares = getProxyMiddlewares(devConfig.devServer?.proxy);
        if (middlewares) {
          wrappingApp.use(...middlewares.map(({ middleware }) => middleware));
        }
      }
    }

    // SERVER SIDE RENDERING
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const render: Render = require(path.join(
      process.cwd(),
      entrypoint,
    )).default;

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

function getManifestPathFromWebpackconfig(
  webpackConfig: webpack.Configuration,
) {
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
