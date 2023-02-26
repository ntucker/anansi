import { ServerProps } from './types.js';

const appSpout =
  (app: JSX.Element) =>
  <P extends ServerProps>(props: P) =>
    Promise.resolve({ ...props, app });

export default appSpout;
