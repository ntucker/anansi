import type { JSX } from 'react';
const appSpout =
  (app: JSX.Element) =>
  <P extends Record<string, unknown>>(props: P) =>
    Promise.resolve({ ...props, app });

export default appSpout;
