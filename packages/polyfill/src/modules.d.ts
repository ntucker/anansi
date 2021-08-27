type RequestIdleCallbackHandle = any;

type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare module 'intl/locale-data/jsonp/en' {}
declare module 'whatwg-fetch' {}
declare module 'ric-shim' {
  export function cancelIdleCallback(handle: RequestIdleCallbackHandle): void;
  function requestIdleCallback(
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    opts?: IdleRequestOptions,
  ): RequestIdleCallbackHandle;
  namespace requestIdleCallback {
    export function cancelIdleCallback(handle: RequestIdleCallbackHandle): void;
  }
  export default requestIdleCallback;
}

declare namespace NodeJS {
  interface Global {
    requestIdleCallback: typeof window['requestIdleCallback'];
    cancelIdleCallback: typeof window['requestIdleCallback'];
  }
}
