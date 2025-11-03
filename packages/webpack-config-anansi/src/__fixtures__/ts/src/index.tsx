import React from 'react';

interface AppProps {
  name?: string;
}

function App({ name = 'TypeScript' }: AppProps) {
  return (
    <div>
      <h1>Hello from {name} fixture</h1>
    </div>
  );
}

export default App;

