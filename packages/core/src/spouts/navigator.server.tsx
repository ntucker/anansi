import React from 'react';

import { NavigatorContext, parseAcceptLanguage } from './navigator.context.js';
import type { ServerSpout } from './types.js';

type NeededNext = {
  initData?: Record<string, () => unknown>;
};

export default function navigatorSpout(): ServerSpout<
  Record<string, unknown>,
  { language: string; languages: readonly string[] },
  NeededNext
> {
  return next => async props => {
    const acceptLanguage = props.req.headers['accept-language'];
    const header =
      typeof acceptLanguage === 'string' ? acceptLanguage : acceptLanguage?.[0];
    const navigatorProps = parseAcceptLanguage(header);

    const nextProps = await next({
      ...props,
      ...navigatorProps,
    });

    return {
      ...nextProps,
      ...navigatorProps,
      initData: {
        ...nextProps.initData,
        navigator: () => navigatorProps,
      },
      app: (
        <NavigatorContext value={navigatorProps}>
          {nextProps.app}
        </NavigatorContext>
      ),
    };
  };
}
