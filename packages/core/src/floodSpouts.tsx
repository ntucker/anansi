import { hydrateRoot } from 'react-dom/client';

export default async function floodSpouts(
  spouts: () => Promise<{
    app: JSX.Element;
  }>,
  { rootId = 'anansi-root' }: { rootId?: string } = {},
) {
  const { app } = await spouts();

  hydrateRoot(document.getElementById(rootId) ?? document, app);
}
