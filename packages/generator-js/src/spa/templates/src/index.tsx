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
<% } else { %>
ReactDOM.createRoot(document.getElementById('react')).render(content);
<% } %>
