import { useController } from 'rest-hooks';
import React, {
  createContext,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { schema } from '@rest-hooks/rest';

import PlaceholderBaseResource from 'resources/PlaceholderBaseResource';

export const demoContext = createContext({
  cache: true,
  concurrent: true,
  set: (v: { cache?: boolean; concurrent?: boolean }): void => {
    throw new Error('context not set');
  },
});

/**
 * Manages controls to demonstrate contrasting functionality
 */
function DemoProviderOg({ children }: { children: React.ReactNode }) {
  const { resetEntireStore } = useController();
  const [state, setState] = useState({ cache: true, concurrent: true });
  const set = useCallback(
    (v: { cache?: boolean; concurrent?: boolean }) => {
      // super hack to disable cool rest hooks caching
      if ('cache' in v) {
        if (v.cache) {
          (PlaceholderBaseResource as any).memo = function (...args: any) {
            return (PlaceholderBaseResource as any).ogMemo
              .call(this, ...args)
              .extend({
                invalidIfStale: false,
                dataExpiryLength: 60000,
                errorExpiryLength: 1000,
              });
          };
          (PlaceholderBaseResource as any).normalize = (
            PlaceholderBaseResource as any
          ).ogNormalize;
          (PlaceholderBaseResource as any).denormalize = (
            PlaceholderBaseResource as any
          ).ogDenormalize;
          (PlaceholderBaseResource as any).infer = (
            PlaceholderBaseResource as any
          ).ogInfer;
          (PlaceholderBaseResource as any).pk = (
            PlaceholderBaseResource as any
          ).ogPk;
        } else {
          (PlaceholderBaseResource as any).ogMemo = (
            PlaceholderBaseResource as any
          ).memo;
          (PlaceholderBaseResource as any).memo = function (...args: any) {
            return (PlaceholderBaseResource as any).ogMemo
              .call(this, ...args)
              .extend({
                invalidIfStale: true,
                dataExpiryLength: 250,
                errorExpiryLength: 1000,
              });
          };

          // all Resources act like objects instead of entities
          (PlaceholderBaseResource as any).ogNormalize = (
            PlaceholderBaseResource as any
          ).normalize;
          (PlaceholderBaseResource as any).ogDenormalize = (
            PlaceholderBaseResource as any
          ).denormalize;
          (PlaceholderBaseResource as any).ogInfer = (
            PlaceholderBaseResource as any
          ).infer;
          (PlaceholderBaseResource as any).ogPk = (
            PlaceholderBaseResource as any
          ).pk;

          (PlaceholderBaseResource as any).normalize = function (
            this,
            ...args: [any, any, any, any, any, any]
          ) {
            return this.fromJS(
              schema.Object.prototype.normalize.apply(this, args) as any,
            );
          };
          (PlaceholderBaseResource as any).denormalize = function (
            this,
            ...args: [any, any]
          ) {
            return schema.Object.prototype.denormalize.apply(this, args) as any;
          };
          (PlaceholderBaseResource as any).infer = function () {
            return undefined;
          };
          (PlaceholderBaseResource as any).pk = undefined;
        }
      }
      setState(existing => ({ ...existing, ...v }));
      resetEntireStore();
    },
    [resetEntireStore],
  );
  const value = useMemo(() => ({ ...state, set }), [set, state]);

  return <demoContext.Provider value={value}>{children}</demoContext.Provider>;
}
export const DemoProvider = memo(DemoProviderOg);
