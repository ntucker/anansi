import React from 'react';

import type { ClientSpout } from './types.js';

export default function documentSpout(options: {
  head?: React.ReactNode;
  title: string;
}): ClientSpout {
  return next => async props => {
    const nextProps = await next(props);

    return nextProps;
  };
}
