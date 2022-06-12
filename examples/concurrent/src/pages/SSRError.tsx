import { Typography } from 'antd';

const { Title } = Typography;

console.log(window.AbortController);

export default function SSRError() {
  return (
    <>
      <Title level={2}>This will never work server side</Title>
      <p>So this block will fallback to client-side rendering</p>
    </>
  );
}
