<% if (reactMode === 'legacy') { %>import { StrictMode } from 'react';<% } %>
import ReactDOM from 'react-dom';

import RootProvider from './RootProvider';
import App from './App';

const content = (
  <RootProvider>
    <App />
  </RootProvider>
);
<% if (reactMode === 'legacy') { %>
ReactDOM.render(<StrictMode>{content}</StrictMode>, document.getElementById('react'));
<% } else if (reactMode === 'concurrent') { %>
ReactDOM.unstable_createRoot(document.getElementById('react')).render(content);
<% } else { %>
ReactDOM.unstable_createBlockingRoot(document.getElementById('react')).render(content);
<% } %>
