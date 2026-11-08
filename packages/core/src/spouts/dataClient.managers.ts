import { __INTERNAL__, type Manager } from '@data-client/react';

/** Converts `getManagers` into the `managers` form this @data-client/react takes.
 *
 * Versions before 0.19 take an array; 0.19 takes a function that creates each store's Managers.
 * No public API reports the version, so this reads the arity of the internal `initManager()`:
 * older versions either don't export it or give it three arguments, and 0.19 dropped the third.
 * Any other arity is treated as 0.19 or later.
 *
 * The spouts load this module with `import()` so @data-client/react stays an optional peer.
 */
export function toManagers(getManagers?: () => Manager[]): any {
  if (!getManagers) return undefined;
  const arity = __INTERNAL__.initManager?.length;
  return arity === undefined || arity === 3 ? getManagers() : getManagers;
}
