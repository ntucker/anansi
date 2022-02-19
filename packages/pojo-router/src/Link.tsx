import React, { useCallback } from 'react';

import { useController } from './hooks';

export type LinkProps<
  P extends Pick<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'onClick' | 'target'
  >,
> = {
  name: string;
  props?: object;
  state?: any;
  replace: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & (
  | ({ component: React.ComponentType<P> } & P)
  | ({
      component: string;
      children: React.ReactNode;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
); // for builtins use anchor tag props

export default function Link<
  P extends Pick<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'onClick' | 'target'
  > = React.AnchorHTMLAttributes<HTMLAnchorElement>,
>({
  name,
  props,
  state,
  replace,
  component: Component,
  onClick,
  ...rest
}: LinkProps<P>) {
  const controller = useController();
  const pathname = controller.buildPath(name, props);
  const handleClick = useCallback(
    e => {
      e?.preventDefault();
      onClick?.(e);

      // let browser handle "target=_blank" etc.
      if (!rest.target || rest.target === '_self') {
        if (replace) {
          controller.history.replace(pathname, state);
        } else {
          controller.history.push(pathname, state);
        }
      }
    },
    [onClick, rest.target, replace, controller.history, pathname, state],
  );

  return <Component onClick={handleClick} href={pathname} {...(rest as any)} />;
}
Link.defaultProps = {
  component: 'a',
  replace: false,
};
