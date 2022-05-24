import { renderToPipeableStream as reactRender } from 'react-dom/server';

import { Render } from './scripts/types';
import { ServerProps } from './spouts/types';

export default function laySpouts(
  spouts: (props: ServerProps) => Promise<{
    app: JSX.Element;
  }>,
  { timeoutMS = 200 }: { timeoutMS?: number } = {},
) {
  const render: Render = async (clientManifest, req, res) => {
    const { app } = await spouts({ clientManifest, req, res });
    let didError = false;
    const { pipe, abort } = reactRender(
      app,
      /*
      This is not documented, so included the types here for reference:
type Options = {|
  identifierPrefix?: string,
  namespaceURI?: string,
  nonce?: string,
  bootstrapScriptContent?: string,
  bootstrapScripts?: Array<string>,
  bootstrapModules?: Array<string>,
  progressiveChunkSize?: number,
  onShellReady?: () => void,
  onShellError?: () => void,
  onAllReady?: () => void,
  onError?: (error: mixed) => void,
|};
  */
      {
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
        onError(x: any) {
          didError = true;
          console.error(x);
          res.statusCode = 500;
          //pipe(res); Removing this avoids, "React currently only supports piping to one writable stream."
        },
      },
    );
    // Abandon and switch to client rendering if enough time passes.
    // Try lowering this to see the client recover.
    setTimeout(abort, timeoutMS);
  };
  return render;
}
