import { memo } from 'react';
import { MatchedRoute } from '@anansi/router';
import { AsyncBoundary } from '@data-client/react';

<% if (style === 'linaria') { %>
import { css } from '@linaria/core';
import 'style/main.css';
<% } else { %>
import 'style/main.scss';
<% } %>


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
import * as styles from './App.scss';
const home = styles.home
<% } %>

// Typically place global navigation and routing layer in here
function App() {
  return (
    <div className={home}>
      <nav>Anansi</nav>
      <main>
        <AsyncBoundary>
          <MatchedRoute index={0} />
        </AsyncBoundary>
      </main>
    </div>
  );
}
export default memo(App);
