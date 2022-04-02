<% if (reactMode === 'legacy') { %>import { StrictMode } from 'react';<% } %>
import ReactDOM from 'react-dom<% if (reactMode !== 'legacy') { %>/client<% } %>';

import RootProvider from './RootProvider';
import App from './App';

const content = (
  <RootProvider>
    <App />
  </RootProvider>
);
<% if (reactMode === 'legacy') { %>
ReactDOM.render(<StrictMode>{content}</StrictMode>, document.getElementById('react'));
<% } else { %>
ReactDOM.createRoot(document.getElementById('react') || document.body).render(content);
<% } %>
