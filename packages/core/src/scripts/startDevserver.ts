#!/usr/bin/env node
Object.hasOwn =
  Object.hasOwn ||
  /* istanbul ignore next */ function hasOwn(it, key) {
    return Object.prototype.hasOwnProperty.call(it, key);
  };
import type { NextFunction } from 'express';
import diskFs from 'fs';
import { createFsRequire } from 'fs-require';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { createFsFromVolume, Volume } from 'memfs';
import path from 'path';
import sourceMapSupport from 'source-map-support';
import tmp from 'tmp';
import { ufs } from 'unionfs';
import { promisify } from 'util';
import webpack, { MultiCompiler } from 'webpack';
import logging from 'webpack/lib/logging/runtime.js';
import WebpackDevServer from 'webpack-dev-server';

import 'cross-fetch/dist/node-polyfill.js';
import { getWebpackConfig } from './getWebpackConfig.js';
import { BoundRender } from './types.js';

// run directly from node
if ('main' in import.meta) {
  const entrypoint = process.argv[2];

  if (!entrypoint) {
    console.log(`Usage: start-anansi <entrypoint-file>`);
    process.exit(-1);
  }

  startDevServer(entrypoint);
}

let serverFileContents: Promise<string> = Promise.resolve('');

export default async function startDevServer(
  entrypoint: string,
  env: Record<string, unknown> = {},
) {
  const webpackConfig = await getWebpackConfig();

  const log = logging.getLogger('anansi-devserver');

  // Set up in memory filesystem
  const volume = new Volume();
  const fs = createFsFromVolume(volume);
  ufs.use(diskFs).use(fs as any);

  const fsRequire = createFsRequire(ufs);
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
        ...env,
        entrypath: hotEntry(entrypoint).name,
        name: 'client',
      },
      { mode: 'development' },
    ),
    webpackConfig(
      {
        ...env,
        entrypath: entrypoint.replace('.tsx', '.server.tsx'),
        name: 'server',
        BROWSERSLIST_ENV: 'current node',
      },
      { mode: 'development', target: 'node' },
    ),
  ] as const;

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

  let initRender:
    | { args: Parameters<BoundRender>; resolve: () => void }[]
    | undefined = [];
  let render: BoundRender = (...args) =>
    new Promise(resolve => {
      initRender?.push({ args, resolve });
    });

  function importRender(stats: webpack.Stats[]) {
    const [clientStats, serverStats] = stats;
    if (
      clientStats?.compilation?.errors?.length ||
      serverStats?.compilation?.errors?.length
    ) {
      log.error('Errors for client build: ' + clientStats.compilation.errors);
      log.error('Errors for server build: ' + serverStats.compilation.errors);
      // first time, rather than re-render
      if (Array.isArray(initRender)) {
        process.exit(-1);
      }
      log.error('Above compiler errors blocking reload');
      return;
    } else {
      log.info('Launching SSR');
    }

    // ASSETS
    const clientManifest = clientStats.toJson();

    const serverEntry = getServerBundle(serverStats);
    serverFileContents = readFile(serverEntry).then(buf => buf.toString());
    // reload modules
    Object.keys(fsRequire.cache).forEach(key => {
      delete fsRequire.cache[key];
    });
    render = (fsRequire(serverEntry) as any).default.bind(
      undefined,
      clientManifest,
    );
    // SERVER SIDE ENTRYPOINT
    if (Array.isArray(initRender)) {
      initRender.forEach(async init => {
        try {
          log.info('Resolving queued requests');
          await render(...init.args);
          init.resolve();
        } catch (e) {
          log.error('Error when attempting to render queued requests');
          log.error(e);
        }
      });
      initRender = undefined;
    }
  }

  const devServer = new WebpackDevServer(
    // write to memory filesystem so we can import
    {
      ...webpackConfigs[0].devServer,
      devMiddleware: {
        ...webpackConfigs[0]?.devServer?.devMiddleware,
        outputFileSystem: {
          ...fs,
          join: path.join as any,
        } as any,
      },
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        const otherRoutes = [
          process.env.WEBPACK_PUBLIC_PATH,
          ...Object.keys(webpackConfigs[0].devServer?.proxy ?? {}),
        ];
        // serve SSR for non-WEBPACK_PUBLIC_PATH
        devServer.app?.get(
          new RegExp(`^(?!${otherRoutes.join('|')})`),
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

        if (webpackConfigs[0].devServer?.setupMiddlewares) {
          return webpackConfigs[0].devServer.setupMiddlewares(
            middlewares,
            devServer,
          );
        }

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
          } catch (e: any) {
            log.error('Failed to load serve entrypoint');

            throw e;
          }
        } else {
          log.error('Only compiler one stat');
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
}
