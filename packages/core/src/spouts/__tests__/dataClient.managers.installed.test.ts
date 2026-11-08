import { toManagers } from '../dataClient.managers';

it('passes the function form to the installed @data-client/react 0.19', () => {
  const getManagers = () => [];
  expect(toManagers(getManagers)).toBe(getManagers);
});
