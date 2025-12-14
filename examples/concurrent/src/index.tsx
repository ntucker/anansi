import {
  floodSpouts,
  documentSpout,
  dataClientSpout,
  routerSpout,
  JSONSpout,
  appSpout,
  navigatorSpout,
} from '@anansi/core';
import { antdSpout } from '@anansi/core/antd';
import { useController } from '@data-client/react';

import app from '@/app';

import { createRouter } from './routing';

const spouts = documentSpout({ title: 'anansi' })(
  antdSpout()(
    JSONSpout()(
      navigatorSpout()(
        dataClientSpout()(
          routerSpout({
            useResolveWith: useController,
            createRouter,
          })(appSpout(app)),
        ),
      ),
    ),
  ),
);

export default floodSpouts(spouts);
