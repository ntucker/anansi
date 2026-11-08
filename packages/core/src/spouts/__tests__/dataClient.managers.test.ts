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

const withArity = (arity: number) =>
  Object.defineProperty(() => {}, 'length', { value: arity });

describe('toManagers()', () => {
  const managers: Manager[] = [];
  const getManagers = () => managers;

  it('returns undefined without getManagers', () => {
    expect(toManagers()).toBeUndefined();
  });

  it('passes the function to @data-client/react 0.19', () => {
    mockInitManager = withArity(2);
    expect(toManagers(getManagers)).toBe(getManagers);
  });

  it('passes an array to @data-client/react 0.15 through 0.18', () => {
    mockInitManager = withArity(3);
    expect(toManagers(getManagers)).toBe(managers);
  });

  it('passes an array to @data-client/react before 0.15', () => {
    mockInitManager = undefined;
    expect(toManagers(getManagers)).toBe(managers);
  });

  it('reads an arity of 3 from the installed 0.18', () => {
    const { __INTERNAL__ } = jest.requireActual('@data-client/react');
    expect(__INTERNAL__.initManager.length).toBe(3);
  });
});
