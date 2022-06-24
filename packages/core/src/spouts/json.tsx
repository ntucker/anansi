import type { ClientSpout } from './types';

export default function JSONSpout({
  id = 'anansi-json',
}: { id?: string } = {}): ClientSpout<
  Record<string, unknown>,
  { initData: Record<string, unknown> }
> {
  return next => async props => {
    const initData = getDatafromDOM(id);
    return { ...(await next({ ...props, initData })), initData };
  };
}
function getDatafromDOM(id: string): Record<string, unknown> {
  const element: HTMLScriptElement | null = document.querySelector(`#${id}`);
  return element?.text ? JSON.parse(element?.text) : undefined;
}
