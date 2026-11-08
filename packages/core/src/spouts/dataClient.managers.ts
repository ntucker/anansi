import { __INTERNAL__, type Manager } from '@data-client/react';

/** Converts `getManagers` into the `managers` form this @data-client/react takes.
 *
 * 0.19 takes a function that creates each store's Managers; earlier versions take an array.
 * 0.19 also dropped `initManager()`'s third argument, so its arity tells the versions apart.
 */
export function toManagers(getManagers?: () => Manager[]): any {
  if (!getManagers) return undefined;
  return __INTERNAL__.initManager?.length === 2 ? getManagers : getManagers();
}
