import { styled } from '@linaria/react';

const SvgContainer = styled.div`
  width: 32px;
  height: 32px;
  background: url('angle-down-solid.svg');
`;

export default function Media() {
  return (
    <div>
      <h3>
        Hello World <a href="https://true.io">True IO</a>
      </h3>
      <SvgContainer>Hi</SvgContainer>
    </div>
  );
}
