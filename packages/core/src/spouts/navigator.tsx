import React from 'react';

import { NavigatorContext } from './navigator.context.js';
import type { NavigatorProperties } from './navigator.context.js';
import type { ClientSpout } from './types.js';

export default function navigatorSpout(): ClientSpout<{
  getInitialData: (key: string) => Promise<any>;
}> {
  return next => async props => {
    const nextProps = await next(props);
    const navigatorProps: NavigatorProperties = await props
      .getInitialData('navigator')
      .catch(e => {
        console.warn(
          'Navigator initial data could not load, using client navigator. Error:',
          e,
        );
        return {
          language: navigator.language,
          languages: [...navigator.languages],
        };
      });

    return {
      ...nextProps,
      navigator: navigatorProps,
      app: (
        <NavigatorContext value={navigatorProps}>
          {nextProps.app}
        </NavigatorContext>
      ),
    };
  };
}
