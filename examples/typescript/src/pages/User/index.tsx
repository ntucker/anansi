import { UserResource, Address } from 'data/resources';
import { useResource } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import { Typography } from 'antd';

function capFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function User({ match }: RouteChildrenProps<{ id: string }>) {
  let id = 1;
  if (match && match.params && match.params.id) {
    id = Number.parseInt(match.params.id);
  }
  const author = useResource(UserResource.singleRequest(), { id });
  return (
    <>
      <Typography.Title level={2}>{author.name}</Typography.Title>
      <Typography.Paragraph>
        {author.email}
        <br />
        {author.phone}
        <br />
        <a href={`https://${author.website}`}>{author.website}</a>
      </Typography.Paragraph>
      <Typography.Paragraph>
        {author.address ? author.addressDisplay : null}
      </Typography.Paragraph>
    </>
  );
}
