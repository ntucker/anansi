import { Link } from '@anansi/router';
import { Result, Button } from 'antd';

export default function NotFound({ error }: { error: any }) {
  return (
    <Result
      status={error?.status ?? '404'}
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link component={Button} name="Home" type="primary">
          Back Home
        </Link>
      }
    />
  );
}
