import { Typography } from 'antd';

import AngleDownUrl, {
  ReactComponent as AngleDown,
} from './angle-down-solid.svg';

const { Title } = Typography;

export default function Home() {
  return (
    <Title>
      hello world <img src={AngleDownUrl} style={{ width: '1em' }} />{' '}
      <AngleDown style={{ width: '1em' }} />
    </Title>
  );
}
