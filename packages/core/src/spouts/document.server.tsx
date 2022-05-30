import React from 'react';
import type { Route } from '@anansi/router';
import { StatsChunkGroup } from 'webpack';

import type { ServerProps, ResolveProps } from './types';
import Document from './DocumentComponent';

type NeededProps = {
  matchedRoutes: Route<any>[];
  title?: string;
} & ResolveProps;

export default function DocumentSpout(options: {
  head?: React.ReactNode;
  title: string;
  rootId?: string;
  charSet?: string;
}) {
  return function <T extends NeededProps>(
    next: (props: ServerProps) => Promise<T>,
  ) {
    return async (props: ServerProps) => {
      const nextProps = await next(props);

      const publicPath = props.clientManifest.publicPath;

      if (
        Object.keys(props.clientManifest?.entrypoints ?? {}).length < 1 ||
        publicPath === undefined
      )
        throw new Error('Manifest missing entries needed');

      // TODO: consider using this package for build stats in future:
      // https://github.com/facebook/react/tree/main/packages/react-server-dom-webpack
      const assetMap = (assets: { name: string; size?: number }[]) =>
        assets.map(({ name }) => `${publicPath}${name}`);

      const assetList: string[] = [];
      Object.values(props.clientManifest?.entrypoints ?? {}).forEach(
        entrypoint => {
          assetList.push(...assetMap(entrypoint.assets ?? []));
        },
      );
      new Set(
        assetMap(
          Object.values(props.clientManifest.namedChunkGroups ?? {})
            .filter(({ name }) =>
              nextProps.matchedRoutes.some(route => name?.includes(route.name)),
            )
            .flatMap(chunk => [
              ...(chunk.assets ?? []),
              // any chunk preloads
              ...childrenAssets(chunk),
            ]),
        ),
      ).forEach(asset => assetList.push(asset));

      // find additional assets to preload based on matched route
      const assets: {
        href: string;
        as?: string | undefined;
        rel?: string | undefined;
      }[] = assetList
        .filter(asset => !asset.endsWith('.hot-update.js'))
        .map(asset =>
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
            rootId={options.rootId}
          >
            {nextProps.app}
          </Document>
        ),
      };
    };
  };
}

function childrenAssets(chunk: StatsChunkGroup) {
  return chunk.children
    ? Object.values(chunk.children).flatMap(preload =>
        preload.flatMap(c => c.assets ?? []),
      )
    : [];
}
