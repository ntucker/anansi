import type { Policy } from './csp';
import { buildPolicy } from './csp';

type Props = {
  children: React.ReactNode;
  assets: { href: string; as?: string; rel?: string }[];
  head: React.ReactNode;
  scripts: React.ReactNode;
  title: string;
  rootId: string;
  charSet: string;
  csPolicy?: Policy;
  nonce?: string | undefined;
};

export default function Document({
  assets,
  head,
  children,
  title,
  rootId,
  charSet,
  csPolicy,
  nonce,
  scripts,
}: Props) {
  let cspMeta: null | React.ReactNode = null;
  if (csPolicy) {
    // add nonce to policy
    const policy = {
      ...csPolicy,
    };
    if (
      nonce &&
      // nonces negate 'unsafe-inline' so do not add it if that directive exists
      (!policy['script-src'] ||
        !policy['script-src'].includes("'unsafe-inline'"))
    ) {
      if (typeof policy['script-src'] === 'string') {
        policy['script-src'] = [policy['script-src'], `'nonce-${nonce}'`];
      } else {
        policy['script-src'] = [...policy['script-src'], `'nonce-${nonce}'`];
      }
    }
    cspMeta = (
      <meta httpEquiv="Content-Security-Policy" content={buildPolicy(policy)} />
    );
  }
  return (
    <html>
      <head>
        <meta charSet={charSet} />
        {cspMeta}
        {head}
        {assets.map((asset, i) => (
          <link key={i} rel="preload" {...asset} />
        ))}
        <title>{title}</title>
      </head>
      <body>
        <div id={rootId}>{children}</div>
        {scripts}
        {assets
          .filter(({ href }) => href.endsWith('.js'))
          .map(({ href }, i) => (
            <script key={i} src={href} async />
          ))}
      </body>
    </html>
  );
}
Document.defaultProps = {
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="shortcut icon"
        href={`${process.env.WEBPACK_PUBLIC_PATH ?? '/'}favicon.ico`}
      />
    </>
  ),
  charSet: 'utf-8',
  rootId: 'anansi-root',
  scripts: null,
};
