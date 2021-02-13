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
`;
<% } %>

export default function Home() {
  return (
    <% if (style === 'linaria') { %>
    <div className={home}>
    <% } else { %>
    <div
      style={{
        minHeight: '100vh',
        margin: '-8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
    <% } %>
      <nav style={{ position: 'fixed', top: '18px' }}>Anansi</nav>
      <main>
        <p style={{ fontSize: '30px' }}>
          Congrats! You&apos;ve created <%= appName %>!
        </p>
        <p style={{ marginTop: '20px', fontSize: '15px' }}>
          Check out the generated ReadMe for instructions on how to use this
          library
        </p>
        <p style={{ marginTop: '20px', fontSize: '24px' }}>
          <AssetPrice symbol="BTC" />
        </p>
      </main>
    </div>
  );
}
