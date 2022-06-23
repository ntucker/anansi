import type { ResolveProps } from './types';

type NeededNext = ResolveProps;

export default function JSONSpout({
  id = 'anansi-json',
}: { id?: string } = {}) {
  return function <N extends NeededNext, I extends Record<string, unknown>>(
    next: (props: I & { initData: Record<string, unknown> }) => Promise<N>,
  ) {
    return async (props: I) => {
      const initData = getDatafromDOM(id);
      return await next({ ...props, initData });
    };
  };
}
function getDatafromDOM(id: string): Record<string, unknown> {
  const element: HTMLScriptElement | null = document.querySelector(`#${id}`);
  return element?.text ? JSON.parse(element?.text) : undefined;
}
