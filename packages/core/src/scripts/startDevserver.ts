#!/usr/bin/env node

import { promisify } from 'util';
import diskFs from 'fs';
import path from 'path';
import webpack, { MultiCompiler } from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';
import { Server, IncomingMessage, ServerResponse } from 'http';
import express, { NextFunction } from 'express';
import ora from 'ora';
import { patchRequire } from 'fs-monkey';
import tmp from 'tmp';
import sourceMapSupport from 'source-map-support';
import { ufs } from 'unionfs';
import compress from 'compression';
import WebpackDevServer from 'webpack-dev-server';
import importFresh from 'import-fresh';
import chalk from 'chalk';

import 'cross-fetch/polyfill';
import { Render } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require(require.resolve(
  // TODO: use normal resolution algorithm to find webpack file
  path.join(process.cwd(), 'webpack.config'),
));

const entrypoint = process.argv[2];
const PORT = process.env.PORT || 3000;
process.env.WEBPACK_PUBLIC_HOST = `http://localhost:${PORT}`;
process.env.WEBPACK_PUBLIC_PATH = '/assets/';

if (!entrypoint) {
  console.log(`Usage: ${process.argv[0]} <entrypoint-file>`);
  process.exit(-1);
}

console.log(
  chalk.greenBright(`Starting SSR at`),
  chalk.cyanBright(process.env.WEBPACK_PUBLIC_HOST),
);
const loader = ora().start();

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
      entrypoint: hotEntry(entrypoint).name,
      name: 'client',
    },
    { mode: 'development' },
  ),
  webpackConfig(
    {
      entrypoint: entrypoint.replace('.tsx', '.server.tsx'),
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
  return path.join(serverJson.outputPath ?? '', 'main.js');
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
let render: Render;
// Start the express server after the first compilation
function initializeApp(stats: webpack.Stats[]) {
  const [clientStats, serverStats] = stats;
  if (
    clientStats?.compilation?.errors?.length ||
    serverStats?.compilation?.errors?.length
  ) {
    loader.fail('Errors for client build: ' + clientStats.compilation.errors);
    loader.fail('Errors for server build: ' + serverStats.compilation.errors);
    // TODO: handle more gracefully
    process.exit(-1);
  } else {
    loader.info('Launching server');
  }

  const wrappingApp = express();
  // eslint-disable-next-line
  //@ts-ignore
  wrappingApp.use(compress());

  // ASSETS
  const clientManifest = clientStats.toJson();
  const assetRoute = async (req: Request | IncomingMessage, res: any) => {
    const filename =
      req.url
        ?.substring((process.env.WEBPACK_PUBLIC_PATH as string).length)
        .split('?')[0] ?? '';
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
  render = require(getServerBundle(serverStats)).default;
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
      loader.succeed(`SSR Running`);
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
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
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
  },
  compiler,
);
const runServer = async () => {
  await devServer.start();
  devServer.compiler.hooks.done.tap(
    'Anansi Server',
    (multiStats: webpack.MultiStats | webpack.Stats) => {
      if (!multiStats) {
        loader.fail('stats not send');
        process.exit(-1);
      }

      if (!Object.hasOwn(multiStats, 'stats')) return;
      if (server && (multiStats as webpack.MultiStats).stats.length > 1) {
        render = (
          importFresh(
            getServerBundle((multiStats as webpack.MultiStats).stats[1]),
          ) as any
        ).default;
        return;
      }
      if (!server) {
        try {
          initializeApp((multiStats as webpack.MultiStats).stats);
        } catch (e) {
          loader.fail('Failed to initialize app');
          console.error(e);
        }
      }
    },
  );
};
const stopServer = async () => {
  loader.info('Stopping server...');
  await devServer.stop();
  loader.info('Server closed');
};

process.on('SIGINT', () => {
  loader.warn('Received SIGINT, devserver shutting down');
  stopServer();
  process.exit(-1);
});

runServer();
