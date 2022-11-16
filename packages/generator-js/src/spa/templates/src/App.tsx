import { memo } from 'react';
import { MatchedRoute } from '@anansi/router';
import { AsyncBoundary } from '@rest-hooks/react';

<% if (style === 'linaria') { %>
import 'style/main.css';
<% } else { %>
import 'style/main.scss';
<% } %>


// Typically place global navigation and routing layer in here
function App() {
  return <AsyncBoundary><MatchedRoute index={0} /></AsyncBoundary>;
}
export default memo(App);
