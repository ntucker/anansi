import type { Manager } from '@data-client/react';

import { toManagers } from '../dataClient.managers';

let mockInitManager: ((...args: any[]) => void) | undefined;
jest.mock('@data-client/react', () => ({
  __INTERNAL__: {
    get initManager() {
      return mockInitManager;
    },
  },
}));

describe('toManagers()', () => {
  const managers: Manager[] = [];
  const getManagers = () => managers;

  it('returns undefined without getManagers', () => {
    expect(toManagers()).toBeUndefined();
  });

  it('passes the function when initManager takes two arguments (0.19)', () => {
    mockInitManager = (_managers: unknown, _controller: unknown) => {};
    expect(toManagers(getManagers)).toBe(getManagers);
  });

  it('passes an array when initManager takes three arguments', () => {
    mockInitManager = (
      _managers: unknown,
      _controller: unknown,
      _initialState: unknown,
    ) => {};
    expect(toManagers(getManagers)).toBe(managers);
  });

  it('passes an array when initManager is not exported', () => {
    mockInitManager = undefined;
    expect(toManagers(getManagers)).toBe(managers);
  });
});
