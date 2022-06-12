import { ExternalCacheProvider, PromiseifyMiddleware } from 'rest-hooks';
import {
  Controller,
  createReducer,
  initialState,
  Manager,
  applyManager,
  NetworkManager,
} from '@rest-hooks/core';
import { createStore, applyMiddleware } from 'redux';

// TODO: Rework this and upstream to rest hooks
export function createPersistedStore(managers?: Manager[]) {
  const controller = new Controller();
  managers = managers ?? [new NetworkManager()];
  const reducer = createReducer(controller);
  const enhancer = applyMiddleware(
    ...applyManager(managers, controller),
    PromiseifyMiddleware as any,
  );
  const store = createStore(reducer, initialState as any, enhancer);
  managers.forEach(manager => manager.init?.(store.getState()));

  const selector = (state: any) => state;
  function ServerCacheProvider({ children }: { children: React.ReactNode }) {
    return (
      <ExternalCacheProvider
        store={store}
        selector={selector}
        controller={controller}
      >
        {children}
      </ExternalCacheProvider>
    );
  }
  return [ServerCacheProvider, controller, store] as const;
}
