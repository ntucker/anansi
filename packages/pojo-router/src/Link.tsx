import React, { useCallback } from 'react';

import { useController } from './hooks.js';

type ComponentConstraint =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<
      Pick<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        'onClick' | 'target' | 'href'
      >
    >;

export type LinkProps<C extends ComponentConstraint = 'a'> =
  React.ComponentProps<C> & {
    component?: C;
    name: string;
    props?: object;
    state?: any;
    replace?: boolean;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    children: React.ReactNode;
  };

export default function Link<C extends ComponentConstraint = 'a'>({
  name,
  props,
  state,
  replace = false,
  component: Component = 'a' as any,
  onClick,
  ...rest
}: LinkProps<C>) {
  const controller = useController();
  const pathname = controller.buildPath(name, props);
  const shouldHandle =
    !Object.prototype.hasOwnProperty.call(rest, 'target') ||
    (rest as any).target === '_self';
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    e => {
      e?.preventDefault();
      onClick?.(e);

      // let browser handle "target=_blank" etc.
      if (shouldHandle) {
        if (replace) {
          controller.history.replace(pathname, state);
        } else {
          controller.history.push(pathname, state);
        }
      }
    },
    [onClick, shouldHandle, replace, controller.history, pathname, state],
  );

  return <Component onClick={handleClick} href={pathname} {...(rest as any)} />;
}
