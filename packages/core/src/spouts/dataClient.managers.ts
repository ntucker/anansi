import { __INTERNAL__, type Manager } from '@data-client/react';

/** Converts `getManagers` into the `managers` form this @data-client/react takes.
 *
 * Versions before 0.19 take an array. 0.19 takes a function that creates each store's Managers.
 * 0.19 also dropped `initManager()`'s third argument, and versions before 0.15 lack it, so its
 * arity tells the versions apart.
 */
export function toManagers(getManagers?: () => Manager[]): any {
  if (!getManagers) return undefined;
  const arity = __INTERNAL__.initManager?.length;
  return arity === undefined || arity === 3 ? getManagers() : getManagers;
}
