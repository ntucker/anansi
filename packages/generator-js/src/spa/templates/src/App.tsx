import { memo } from 'react';
import { MatchedRoute } from '@anansi/router';
<% if (style === 'linaria') { %>
import 'style/main.css';
<% } else { %>
import 'style/main.scss';
<% } %>

import Boundary from 'components/Boundary';


// Typically place global navigation and routing layer in here
function App() {
  return <Boundary fallback={null}><MatchedRoute index={0} /></Boundary>;
}
export default memo(App);
