import React from 'react';

import BTCPrice from './BtcPrice';

export default function Home() {
  return (
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
          <BTCPrice />
        </p>
      </main>
    </div>
  );
}
