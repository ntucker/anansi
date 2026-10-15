import { useState } from 'react';

export default function App({ name }: { name: string }) {
  const [count] = useState(1);
  return (
    <p>
      Hello {name} {count}
    </p>
  );
}
