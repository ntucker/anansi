import crypto from 'crypto';
import { renderToPipeableStream as reactRender } from 'react-dom/server';

import type { Render } from './scripts/types.js';
import type { ServerProps } from './spouts/types.js';

export default function laySpouts(
  spouts: (props: ServerProps) => Promise<{
    app: JSX.Element;
  }>,
  {
    timeoutMS = 10000,
    onError,
  }: { timeoutMS?: number; onError?: (error: unknown) => void } = {},
) {
  const render: Render = async (clientManifest, req, res) => {
    const nonce = crypto.randomBytes(16).toString('base64');

    try {
      const { app } = await spouts({ clientManifest, req, res, nonce });

      let didError = false;
      const { pipe, abort } = reactRender(app, {
        nonce,
        //bootstrapScripts: assets.filter(asset => asset.endsWith('.js')),
        onShellReady() {
          //managers.forEach(manager => manager.cleanup());
          // If something errored before we started streaming, we set the error code appropriately.
          res.statusCode = didError ? 500 : 200;
          res.setHeader('Content-type', 'text/html');
          pipe(res);
        },
        onShellError() {
          didError = true;
          res.statusCode = 500;
          pipe(res);
        },
        onError(e: any) {
          didError = true;
          console.error(e);
          res.statusCode = 500;
          //pipe(res); Removing this avoids, "React currently only supports piping to one writable stream."
          if (onError) onError(e);
        },
      });
      // Abandon and switch to client rendering if enough time passes.
      // Try lowering this to see the client recover.
      setTimeout(
        () => (abort as any)(`Timeout of ${timeoutMS}ms exceeded`),
        timeoutMS,
      );
    } catch (e: unknown) {
      if (onError) onError(e);
      throw e;
    }
  };
  return render;
}
