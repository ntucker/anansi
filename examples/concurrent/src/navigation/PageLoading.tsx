import { Spin } from 'antd';
import { useShowLoading } from '@anansi/router';
import { styled } from '@linaria/react';

const stat = 'rgba(255, 255, 255, 0.3)';
const dynamic = 'rgba(255, 255, 255, 0.5)';

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  background-color: rgb(25, 0, 0);
  overflow: hidden;
`;

const Eye = styled.div<{ dataLoading: boolean }>`
  display: ${({ dataLoading }) => (dataLoading ? 'block' : 'none')};
  height: 100%;
  width: 20%;
  background-color: red;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.9) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.9) 75%
  );
  animation: 1s linear 0s infinite alternate move_eye;

  @keyframes move_eye {
    from {
      margin-left: -20%;
    }
    to {
      margin-left: 100%;
    }
  }
`;

export default function PageLoading({ timeout = 100 }: { timeout?: number }) {
  const loading = useShowLoading(timeout);

  return (
    <Logo>
      <Eye dataLoading={loading} />
    </Logo>
  );
}
