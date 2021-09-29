import { memo } from 'react';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import MenuItem from 'MenuItem';

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

export const font = css`
  :global() {
    @font-face {
      font-family: 'FaricyNew';
      src: url('./faricy/FaricyNew-Rg.woff') format('woff'),
        url('./faricy/FaricyNew-Rg.otf') format('opentype');
      font-weight: normal;
    }
    @font-face {
      font-family: 'FaricyNew';
      src: url('./faricy/FaricyNew-Lt.woff') format('woff'),
        url('./faricy/FaricyNew-Lt.otf') format('opentype');
      font-weight: 300;
    }
    @font-face {
      font-family: 'FaricyNew';
      src: url('./faricy/FaricyNew-Md.woff') format('woff'),
        url('./faricy/FaricyNew-Md.otf') format('opentype');
      font-weight: 700;
    }
    @font-face {
      font-family: 'FaricyNew';
      src: url('./faricy/FaricyNew-Bd.woff') format('woff'),
        url('./faricy/FaricyNew-Bd.otf') format('opentype');
      font-weight: 800;
    }
  }
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
  font-family: FaricyNew, arial;
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
      <MenuItem>hi</MenuItem>
    </Container>
  </>
);

export default memo(App);
