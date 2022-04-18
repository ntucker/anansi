import { hydrateRoot } from 'react-dom/client';

export default async function floodSpouts(
  spouts: () => Promise<{
    app: JSX.Element;
  }>,
) {
  const { app } = await spouts();

  hydrateRoot(document, app);
}
