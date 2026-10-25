#!/usr/bin/env node
Object.hasOwn =
  Object.hasOwn ||
  /* istanbul ignore next */ function hasOwn(it, key) {
    return Object.prototype.hasOwnProperty.call(it, key);
  };
import compress from 'compression';
import express from 'express';
import { Server } from 'http';
import ora from 'ora';
import path from 'path';
import webpack from 'webpack';

import 'cross-fetch/dist/node-polyfill.js';
import { assetMiddleware } from './assetMiddleware.js';
import getProxyMiddlewares from './getProxyMiddlewares.js';
import { getWebpackConfig } from './getWebpackConfig.js';
import {
  getErrorStatus,
  renderErrorPage,
  serveErrorPageOptions,
} from './ssrErrorHandler.js';
import { Render } from './types.js';

// run directly from node
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (import.meta.main) {
  const entrypoint = process.argv[2];

  if (!entrypoint) {
    console.log(`Usage: ${process.argv[0]} <server-entrypoint>`);
    process.exit(-1);
  }
  serve(entrypoint);
}

export default async function serve(
  entrypoint: string,
  options: { serveAssets?: boolean; serveProxy?: boolean } = {},
) {
  const PORT = process.env.PORT || 8080;

  const loader = ora('Initializing').start();

  const webpackConfig = await getWebpackConfig();

  const manifestPath = getManifestPathFromWebpackconfig(
    webpackConfig({}, { mode: 'production' }),
  );

  let server: Server | undefined;

  // every failure, from SSR or any middleware, gets the same error page
  const handleErrors: express.ErrorRequestHandler = (
    error,
    req,
    res,
    next,
  ) => {
    console.error('Server error:', error);
    // too late for a page; Express's handler closes the connection
    if (res.headersSent) return next(error);
    const statusCode = getErrorStatus(error);
    res
      .status(statusCode)
      .type('html')
      .send(
        renderErrorPage(
          error,
          req.url,
          statusCode,
          serveErrorPageOptions(statusCode, process.env.NODE_ENV),
        ),
      );
  };

  // Start the express server after the first compilation
  async function initializeApp(clientManifest: webpack.StatsCompilation) {
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
      if (clientManifest.outputPath) {
        wrappingApp.use(
          assetMiddleware(
            process.env.WEBPACK_PUBLIC_PATH || '/',
            clientManifest.outputPath,
          ),
        );
      } else {
        loader.warn('Manifest has no outputPath; not serving assets');
      }
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
    let render: Render = (await import(path.join(process.cwd(), entrypoint)))
      .default;

    if ('default' in render) {
      render = render.default as any;
    }

    if (typeof render !== 'function') {
      throw new Error(
        `default export of ${path.join(
          process.cwd(),
          entrypoint,
        )} is not a function`,
      );
    }

    wrappingApp.get('/{*splat}', async function (req: any, res: any) {
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
    });
    wrappingApp.use(handleErrors);

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

  let manifest = await import(manifestPath, { with: { type: 'json' } });
  // handle inconsistent import conditions
  if ('default' in manifest) {
    manifest = manifest.default;
  }
  await initializeApp(manifest);

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
        return plugin?.constructor.name === 'StatsWriterPlugin';
      }) as any
    )?.opts?.filename ?? 'manifest.json';

  const manifestPath = path.join(
    webpackConfig?.output?.path ?? '',
    manifestFilename,
  );
  return manifestPath;
}
