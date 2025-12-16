import type { ClientSpout } from './types.js';

export default function JSONSpout({
  id = 'anansi-json',
}: { id?: string } = {}): ClientSpout<
  Record<string, unknown>,
  { getInitialData: (key: string) => Promise<any> }
> {
  return next => async props => {
    const getInitialData = (key: string) => {
      const globalId = `${id}.${key}`;
      return new Promise<any>((resolve, reject) => {
        let el: HTMLScriptElement | null;
        if ((el = document.getElementById(globalId) as any)) {
          resolve(getDataFromEl(el, globalId));
          return;
        }
        document.addEventListener('DOMContentLoaded', () => {
          el = document.getElementById(globalId) as any;
          if (el) resolve(getDataFromEl(el, globalId));
          else reject(new Error(`failed to find DOM with ${key} state`));
        });
      });
    };
    return { ...(await next({ ...props, getInitialData })), getInitialData };
  };
}

function getDataFromEl(el: HTMLScriptElement, key: string) {
  if (el.text === undefined) {
    console.error(
      `#${key} is completely empty. This could be due to CSP issues.`,
    );
  }
  if (!el?.text) return undefined;
  try {
    return JSON.parse(el.text);
  } catch (error) {
    console.error(`Failed to parse JSON for #${key}:`, error);
    console.error('Text content:', el.text);
    return undefined;
  }
}
