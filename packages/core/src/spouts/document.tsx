import type { Route } from '@anansi/router';
import React from 'react';

import type { ClientSpout } from './types';

export default function documentSpout(options: {
  head?: React.ReactNode;
  title: string;
}): ClientSpout {
  return next => async props => {
    const nextProps = await next(props);

    return nextProps;
  };
}
