import { memo } from 'react';
import { MatchedRoute, AsyncBoundary } from '@anansi/router';

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
