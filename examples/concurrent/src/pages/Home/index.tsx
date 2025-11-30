import { useNavigator } from '@anansi/core';
import { Typography } from 'antd';

import AngleDownUrl, {
  ReactComponent as AngleDown,
} from './angle-down-solid.svg';

const { Title, Text } = Typography;

export default function Home() {
  const { language, languages } = useNavigator();

  return (
    <>
      <Title>
        hello world <img src={AngleDownUrl} style={{ width: '1em' }} />{' '}
        <AngleDown style={{ width: '1em' }} />
      </Title>
      <Text type="secondary">
        Language: {language} | All: {languages.join(', ')}
      </Text>
    </>
  );
}
