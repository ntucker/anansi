type Props = {
  children: React.ReactNode;
  assets: { href: string; as?: string; rel?: string }[];
  head: React.ReactNode;
  extraStyle: React.ReactNode;
  scripts: React.ReactNode;
  title: string;
  rootId: string;
  charSet: string;
};

export default function Document({
  assets,
  head,
  children,
  title,
  rootId,
  charSet,
  scripts,
  extraStyle,
}: Props) {
  return (
    <html>
      <head>
        <meta charSet={charSet} />
        {head}
        {extraStyle}
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
