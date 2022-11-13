import { GQLEndpoint, GQLEntity } from '@rest-hooks/graphql';
import { useSuspense } from 'rest-hooks';

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
