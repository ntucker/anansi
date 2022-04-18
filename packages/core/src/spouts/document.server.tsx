import React from 'react';
import type { Route } from '@anansi/router';

import type { ServerProps, ResolveProps } from './types';
import Document from './DocumentComponent';

type NeededProps = {
  matchedRoutes: Route<any>[];
  title?: string;
} & ResolveProps;

export default function DocumentSpout(options: {
  head?: React.ReactNode;
  title: string;
}) {
  return function <T extends NeededProps>(
    next: (props: ServerProps) => Promise<T>,
  ) {
    return async (props: ServerProps) => {
      const nextProps = await next(props);

      const entrypoint = props.clientManifest?.entrypoints?.main;
      const publicPath = props.clientManifest.publicPath;

      if (entrypoint === undefined || publicPath === undefined)
        throw new Error('Manifest missing entries needed');

      // TODO: consider using this package for build stats in future:
      // https://github.com/facebook/react/tree/main/packages/react-server-dom-webpack
      const assetMap = (assets: { name: string; size?: number }[]) =>
        assets.map(({ name }) => `${publicPath}${name}`);
      // find additional assets to preload based on matched route
      const assets = assetMap([
        ...(entrypoint.assets ?? []),
        ...(entrypoint.children?.prefetch?.find?.(({ name }) =>
          nextProps.matchedRoutes.some(route => name === route.name),
        )?.assets ?? []),
      ]).map(asset =>
        asset.endsWith('.css')
          ? { href: asset, rel: 'stylesheet' }
          : asset.endsWith('.js')
          ? { href: asset, as: 'script' }
          : { href: asset },
      );

      return {
        ...nextProps,
        app: (
          <Document
            {...options}
            title={nextProps.title ?? options.title}
            assets={assets}
          >
            {nextProps.app}
          </Document>
        ),
      };
    };
  };
}
