type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};
type cancelIdleCallback = ((handle: RequestIdleCallbackHandle) => void);
interface requestIdleCallback {
  (
    callback: ((deadline: RequestIdleCallbackDeadline) => void),
    opts?: RequestIdleCallbackOptions,
  ): RequestIdleCallbackHandle;
  cancelIdleCallback: cancelIdleCallback;
}

declare module 'intl/locale-data/jsonp/en' {
}
declare module 'whatwg-fetch' {
}
declare module 'ric-shim' {
  export = requestIdleCallback;
}
declare module NodeJS  {
  interface Global {
    requestIdleCallback: requestIdleCallback;
    cancelIdleCallback: cancelIdleCallback;
  }
}
