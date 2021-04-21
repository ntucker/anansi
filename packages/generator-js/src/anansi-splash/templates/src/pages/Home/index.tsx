<% if (style === 'linaria') { %>
import { css } from '@linaria/core';
<% } %>

import AssetPrice from './AssetPrice';

<% if (style === 'linaria') { %>
const margin = '8px';

const home = css`
  min-height: 100vh;
  margin: -${margin};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
  text-align: center;

  > nav {
    position: fixed;
    top: 18px;
  }

  p:not(:first-child) {
    margin-top: 20px;
  }
`;
<% } else { %>
import styles from './index.scss';
const home = styles.home
<% } %>

export default function Home() {
  return (
    <div className={home}>
      <nav>Anansi</nav>
      <main>
        <p style={{ fontSize: '30px' }}>
          Congrats! You&apos;ve created <%= appName %>!
        </p>
        <p style={{ fontSize: '15px' }}>
          Check out the generated ReadMe for instructions on how to use this
          library
        </p>
        <p style={{ fontSize: '24px' }}>
          <AssetPrice symbol="BTC" />
        </p>
      </main>
    </div>
  );
}
