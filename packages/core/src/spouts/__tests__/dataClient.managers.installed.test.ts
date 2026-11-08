import { toManagers } from '../dataClient.managers';

it('passes the function form to the installed @data-client/react', () => {
  const getManagers = () => [];
  expect(toManagers(getManagers)).toBe(getManagers);
});
