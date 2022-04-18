import { promisify } from 'util';
import diskFs from 'fs';
import path from 'path';
import webpack, { MultiCompiler, StatsCompilation } from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { createFsFromVolume, Volume } from 'memfs';
import { Server, IncomingMessage, ServerResponse } from 'http';
import express, { Express, NextFunction } from 'express';
import ora from 'ora';
import { patchRequire } from 'fs-monkey';
import tmp from 'tmp';
import sourceMapSupport from 'source-map-support';
import { ufs } from 'unionfs';
import compress from 'compression';

import 'cross-fetch/polyfill';
import { Render } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require('../webpack.config');

const entrypoint = process.argv[2];
const PORT = process.env.PORT || 3000;
process.env.WEBPACK_PUBLIC_HOST = `http://localhost:${PORT}`;
process.env.WEBPACK_PUBLIC_PATH = '/assets/';

if (!entrypoint) {
  console.log(`Usage: ${process.argv[0]} <entrypoint-file>`);
  process.exit(-1);
}

const loader = ora('Building the assets').start();

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
    Number.parseInt(generatedEntrypoint.fd),
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
      entrypoint: hotEntry(entrypoint.replace('.tsx', '.server.tsx')).name,
      name: 'server',
    },
    { mode: 'development', target: 'node' },
  ),
] as const;
// initialize the webpack compiler
const compiler: MultiCompiler = webpack(webpackConfigs);

compiler.outputFileSystem = {
  ...fs,
  join: path.join as any,
} as any as typeof fs;

sourceMapSupport.install({ hookRequire: true });

function getServerBundle(serverStats: webpack.Stats) {
  const serverJson = serverStats.toJson({ assets: true });
  return path.join(serverJson.outputPath, 'main.js');
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

// Start the express server after the first compilation
function initializeApp(stats: webpack.Stats[]) {
  loader.info('Launching server');
  const [clientStats, serverStats] = stats;
  if (
    clientStats?.compilation?.errors?.length ||
    serverStats?.compilation?.errors?.length
  ) {
    console.log('Errors for client build: ', clientStats.compilation.errors);
    console.log('Errors for server build:', serverStats.compilation.errors);
    // TODO: handle more gracefully
    process.exit(-1);
  }

  const wrappingApp = express();
  // eslint-disable-next-line
  //@ts-ignore
  wrappingApp.use(compress());

  // ASSETS
  wrappingApp.use(
    webpackHotMiddleware(compiler.compilers[0], {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
      noInfo: true,
      name: 'client',
    }),
  );
  const clientManifest = clientStats.toJson();
  const assetRoute = async (req, res) => {
    const filename = req.url.substr(process.env.WEBPACK_PUBLIC_PATH.length);
    const assetPath = path.join(clientManifest.outputPath, filename);

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
  const render: Render = require(getServerBundle(serverStats)).default;
  wrappingApp.get(
    '/*',
    handleErrors(async function (req: any, res: any) {
      if (req.url.endsWith('favicon.ico')) {
        res.statusCode = 404;
        res.setHeader('Content-type', 'text/html');
        res.send('not found');
        return;
      }
      res.socket.on('error', error => {
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
      const isPipe = portOrPipe => Number.isNaN(portOrPipe);
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

// Watch the files for changes
const watcher = compiler.watch({}, (err, multiStats) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  if (server) {
    loader.succeed('Webpack bundle updated');
    return;
  }
  try {
    initializeApp(multiStats.stats);
  } catch (e) {
    console.error('Failed to initialize app');
    console.error(e);
  }
});

process.on('SIGINT', () => {
  loader.warn('Received SIGINT, devserver shutting down');
  if (server) console.log('Closing server');
  server?.close(() => {
    loader.info('Server closed');
  });
  watcher.close(() => {
    loader.info('webpack build stopped');
  });
  process.exit(-1);
});
