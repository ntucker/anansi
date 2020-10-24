import { memo } from 'react';
import { css } from 'linaria';
import { styled } from 'linaria/react';

type Params = {
  type: 'min-width' | 'max-width';
  width: number;
  important?: boolean;
};

// Linaria seems very particular about what exactly you can interpolate
const media = {
  phone: '560px',
  tablet: '768px',
  desktop: '769px',
  giant: '1170px',
};

const neato = css`
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
`;

const Container = styled.div`
  border-radius: 4px;
  border: thin #eee solid;
  background-color: crimson;
  padding: 16px;
  ${neato}
  @media (max-width ${media.tablet}) {
    background-color: blueviolet;
  }
`;

const Text = styled.p`
  font-size: 16px;
  color: white;
  font-weight: bold;
`;

const header = css`
  text-transform: uppercase;
`;

const App = () => (
  <>
    <h1 className={header}>Linaria Test</h1>
    <Container>
      <Text>hello world!</Text>
    </Container>
  </>
);

export default memo(App);
