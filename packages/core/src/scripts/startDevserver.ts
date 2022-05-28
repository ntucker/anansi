#!/usr/bin/env node

import { promisify } from 'util';
import diskFs from 'fs';
import path from 'path';
import webpack, { MultiCompiler } from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';
import { Server, IncomingMessage, ServerResponse } from 'http';
import type { NextFunction } from 'express';
import { patchRequire } from 'fs-monkey';
import tmp from 'tmp';
import sourceMapSupport from 'source-map-support';
import { ufs } from 'unionfs';
import WebpackDevServer from 'webpack-dev-server';
import importFresh from 'import-fresh';
import logging from 'webpack/lib/logging/runtime';

import 'cross-fetch/polyfill';
import { BoundRender } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require(require.resolve(
  // TODO: use normal resolution algorithm to find webpack file
  path.join(process.cwd(), 'webpack.config'),
));

const entrypoint = process.argv[2];
//process.env.WEBPACK_PUBLIC_HOST = `http://localhost:${PORT}`; this breaks compatibility with stackblitz
process.env.WEBPACK_PUBLIC_PATH = '/assets/';

if (!entrypoint) {
  console.log(`Usage: start-anansi <entrypoint-file>`);
  process.exit(-1);
}

const log = logging.getLogger('anansi-devserver');

// Set up in memory filesystem
const volume = new Volume();
const fs = createFsFromVolume(volume);
ufs.use(diskFs).use(fs as any);

patchRequire(ufs);
const readFile = promisify(ufs.readFile);
let server: Server | undefined;

// Generate a temporary file so we can hot reload from the root of the application
function hotEntry(entryPath: string) {
  // eslint-disable-next-line
  // @ts-ignore for some reason it's not picking up that other options are optional
  const generatedEntrypoint = tmp.fileSync({ postfix: '.js' });
  diskFs.writeSync(
    generatedEntrypoint.fd,
    `
import entry from "${path.resolve(process.cwd(), entryPath)}";

if (module.hot) {
  module.hot.accept();
}

export default entry;
  `,
  );
  return generatedEntrypoint;
}

const webpackConfigs = [
  webpackConfig(
    {
      entrypath: hotEntry(entrypoint).name,
      name: 'client',
    },
    { mode: 'development' },
  ),
  webpackConfig(
    {
      entrypath: entrypoint.replace('.tsx', '.server.tsx'),
      name: 'server',
    },
    { mode: 'development', target: 'node' },
  ),
] as const;
// only have one output for server so we can avoid cached modules
webpackConfigs[1].plugins.push(
  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
);
// initialize the webpack compiler
const compiler: MultiCompiler = webpack(webpackConfigs);

sourceMapSupport.install({ hookRequire: true });

function getServerBundle(serverStats: webpack.Stats) {
  const serverJson = serverStats.toJson({ assets: true });
  return path.join(serverJson.outputPath ?? '', 'server.js');
}
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
let render: BoundRender;
function importRender(stats: webpack.Stats[]) {
  const [clientStats, serverStats] = stats;
  if (
    clientStats?.compilation?.errors?.length ||
    serverStats?.compilation?.errors?.length
  ) {
    log.error('Errors for client build: ' + clientStats.compilation.errors);
    log.error('Errors for server build: ' + serverStats.compilation.errors);
    // TODO: handle more gracefully
    process.exit(-1);
  } else {
    log.info('Launching SSR');
  }

  // ASSETS
  const clientManifest = clientStats.toJson();

  // SERVER SIDE RENDERING
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  render = (importFresh(getServerBundle(serverStats)) as any).default.bind(
    undefined,
    clientManifest,
  );
}

const devServer = new WebpackDevServer(
  // write to memory filesystem so we can import
  {
    ...webpackConfigs[0].devServer,
    /*client: {
      ...webpackConfigs[0].devServer?.client,
      webSocketURL: {
        ...webpackConfigs[0].devServer?.client.webSocketURL,
        port: 8080,
      },
    },*/
    devMiddleware: {
      ...webpackConfigs[0]?.devServer?.devMiddleware,
      outputFileSystem: {
        ...fs,
        join: path.join as any,
      } as any as typeof fs,
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // serve SSR for non-WEBPACK_PUBLIC_PATH
      devServer.app?.get(
        new RegExp(`^(?!${process.env.WEBPACK_PUBLIC_PATH})`),
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

          await render(req, res);
        }),
      );

      return middlewares;
    },
  },
  compiler,
);
const runServer = async () => {
  await devServer.start();
  devServer.compiler.hooks.done.tap(
    'Anansi Server',
    (multiStats: webpack.MultiStats | webpack.Stats) => {
      if (!multiStats) {
        log.error('stats not send');
        process.exit(-1);
      }

      if (!Object.hasOwn(multiStats, 'stats')) return;
      if ((multiStats as webpack.MultiStats).stats.length > 1) {
        try {
          importRender((multiStats as webpack.MultiStats).stats);
        } catch (e) {
          log.error('Failed to load serve entrypoint');
          console.error(e);
        }
      }
    },
  );
};
const stopServer = async () => {
  log.info('Stopping server...');
  await devServer.stop();
  log.info('Server closed');
};

process.on('SIGINT', () => {
  log.warn('Received SIGINT, devserver shutting down');
  stopServer();
  process.exit(-1);
});

runServer();
