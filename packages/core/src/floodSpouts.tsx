import type { JSX } from 'react';
import { hydrateRoot } from 'react-dom/client';

export default async function floodSpouts(
  spouts: (props: Record<string, unknown>) => Promise<{
    app: JSX.Element;
  }>,
  { rootId = 'anansi-root' }: { rootId?: string } = {},
) {
  const { app } = await spouts({});

  hydrateRoot(document.getElementById(rootId) ?? document, app);
}
