import { Controller } from '@rest-hooks/core';
import { lazy, Route } from '@anansi/router';
import { getImage } from '@rest-hooks/img';
import { getExchangeRates } from 'resources/ExchangeRatesResource';

const lazyPage = (pageName: string) =>
  lazy(
    () =>
      import(
        /* webpackChunkName: '[request]', webpackPrefetch: true */ `pages/${pageName}`
      ),
  );

export const namedPaths = {
  Home: '/',
} as const;

export const routes: Route<Controller>[] = [
  {
    name: 'Home',
    component: lazyPage('Home'),
    async resolveData(controller) {
      await controller.fetch(getExchangeRates, {
        currency: 'USD',
      });
    },
  },
];
