import React from 'react';

import type { ClientSpout } from './types.js';

export default function documentSpout(_options: {
  head?: React.ReactNode;
  title: string;
}): ClientSpout<
  Record<string, unknown>,
  Record<string, unknown>,
  { extraStyle?: React.ReactNode[] }
> {
  return next => async props => {
    const nextProps = await next(props);

    // Inject extraStyle into the DOM head
    if (nextProps.extraStyle) {
      nextProps.extraStyle.forEach(styleNode => {
        if (React.isValidElement(styleNode) && styleNode.type === 'style') {
          const styleProps = styleNode.props as {
            dangerouslySetInnerHTML?: { __html: string };
          };
          const innerHTML = styleProps.dangerouslySetInnerHTML?.__html;
          if (innerHTML) {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = innerHTML;
            if (styleNode.key) {
              styleEl.setAttribute('data-key', String(styleNode.key));
            }
            document.head.appendChild(styleEl);
          }
        }
      });
    }

    return nextProps;
  };
}
