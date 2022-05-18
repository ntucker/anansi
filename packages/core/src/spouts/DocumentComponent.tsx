type Props = {
  children: React.ReactNode;
  assets: { href: string; as?: string; rel?: string }[];
  head: React.ReactNode;
  title: string;
};

export default function Document({ assets, head, children, title }: Props) {
  return (
    <html>
      <head suppressHydrationWarning={true}>
        {head}
        {assets.map((asset, i) => (
          <link key={i} rel="preload" {...asset} />
        ))}
        <title>{title}</title>
      </head>
      <body>
        {children}
        {/* this ensures the client can hydrate the assets prop */}
        <script
          dangerouslySetInnerHTML={{
            __html: `assetManifest = ${JSON.stringify(assets)};`,
          }}
        />
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
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/assets/favicon.ico" />
    </>
  ),
};
