import { GQLEndpoint, GQLEntity } from '@data-client/graphql';
import { useSuspense } from '@data-client/react';

const gql = new GQLEndpoint('https://nosy-baritone.glitch.me');

class User extends GQLEntity {
  declare readonly name: string;
  declare readonly email: string;
}

const userList = gql.query(
  `{
	users {
		id
		name
		email
	}
}`,
  { users: [User] },
);

export default function GQL() {
  const { users } = useSuspense(userList);
  return (
    <div>
      {users.map(user => (
        <div key={user.pk()}>
          {user.name} {user.email}
        </div>
      ))}
    </div>
  );
}
