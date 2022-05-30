import AssetPrice from './AssetPrice';

export default function Home() {
  return (
    <>
      <p style={{ fontSize: '30px' }}>
        Congrats! You&apos;ve created <%= appName %>!
      </p>
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
