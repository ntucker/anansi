import { useController } from '@data-client/react';
import { schema } from '@data-client/rest';
import React, {
  createContext,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { PlaceholderEntity } from 'resources/PlaceholderBaseResource';

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
      // super hack to disable cool reactive data client caching
      if ('cache' in v) {
        if (v.cache) {
          (PlaceholderEntity as any).memo = function (...args: any) {
            return (PlaceholderEntity as any).ogMemo
              .call(this, ...args)
              .extend({
                invalidIfStale: false,
                dataExpiryLength: 60000,
                errorExpiryLength: 1000,
              });
          };
          (PlaceholderEntity as any).normalize = (
            PlaceholderEntity as any
          ).ogNormalize;
          (PlaceholderEntity as any).denormalize = (
            PlaceholderEntity as any
          ).ogDenormalize;
          (PlaceholderEntity as any).infer = (PlaceholderEntity as any).ogInfer;
          (PlaceholderEntity as any).pk = (PlaceholderEntity as any).ogPk;
        } else {
          (PlaceholderEntity as any).ogMemo = (PlaceholderEntity as any).memo;
          (PlaceholderEntity as any).memo = function (...args: any) {
            return (PlaceholderEntity as any).ogMemo
              .call(this, ...args)
              .extend({
                invalidIfStale: true,
                dataExpiryLength: 250,
                errorExpiryLength: 1000,
              });
          };

          // all Resources act like objects instead of entities
          (PlaceholderEntity as any).ogNormalize = (
            PlaceholderEntity as any
          ).normalize;
          (PlaceholderEntity as any).ogDenormalize = (
            PlaceholderEntity as any
          ).denormalize;
          (PlaceholderEntity as any).ogInfer = (PlaceholderEntity as any).infer;
          (PlaceholderEntity as any).ogPk = (PlaceholderEntity as any).pk;

          (PlaceholderEntity as any).normalize = function (
            this,
            ...args: [any, any, any, any, any, any]
          ) {
            return this.fromJS(
              schema.Object.prototype.normalize.apply(this, args) as any,
            );
          };
          (PlaceholderEntity as any).denormalize = function (
            this,
            ...args: [any, any]
          ) {
            return schema.Object.prototype.denormalize.apply(this, args) as any;
          };
          (PlaceholderEntity as any).infer = function () {
            return undefined;
          };
          (PlaceholderEntity as any).pk = undefined;
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
