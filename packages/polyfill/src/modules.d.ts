type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};
type CIC = (handle: RequestIdleCallbackHandle) => void;
interface RIC {
  (
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    opts?: RequestIdleCallbackOptions,
  ): RequestIdleCallbackHandle;
  cancelIdleCallback: CIC;
}

declare module 'intl/locale-data/jsonp/en' {}
declare module 'whatwg-fetch' {}
declare module 'ric-shim' {
  export function cancelIdleCallback(handle: RequestIdleCallbackHandle): void;
  function requestIdleCallback(
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    opts?: RequestIdleCallbackOptions,
  ): RequestIdleCallbackHandle;
  namespace requestIdleCallback {
    export function cancelIdleCallback(handle: RequestIdleCallbackHandle): void;
  }
  export default requestIdleCallback;
}
// eslint-disable-next-line no-var
declare var requestIdleCallback: RIC;
// eslint-disable-next-line no-var
declare var cancelIdleCallback: CIC;
declare namespace NodeJS {
  interface Global {
    requestIdleCallback: RIC;
    cancelIdleCallback: CIC;
  }
}
