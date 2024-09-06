import AssetPrice from './AssetPrice';
<% if (style === 'linaria') { %>
import { styled } from '@linaria/react';

const Head = styled.p`
  font-size: 30px;
`;
<% } else { %>
const Head = ({children}) => <p style={{ fontSize: '30px' }}>{children}</p>;
<% } %>

export default function Home() {
  return (
    <>
      <Head>
        Congrats! You&apos;ve created <%= appName %>!
      </Head>
      <p style={{ fontSize: '15px' }}>
        Check out the generated ReadMe for instructions on how to use this
        library
      </p>
      <p style={{ fontSize: '24px' }}>
        <AssetPrice symbol="BTC" />
      </p>
    </>
  );
}
