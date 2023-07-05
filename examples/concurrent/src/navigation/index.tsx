import { MatchedRoute } from '@anansi/router';
import { AsyncBoundary } from '@data-client/react';
import { memo } from 'react';

import Nav from './Nav';

function WrapNav() {
  return (
    <AsyncBoundary fallback={<Nav key="nav" friends={[]} />}>
      <MatchedRoute key="friends2" index={0} />
    </AsyncBoundary>
  );
}
export default memo(WrapNav);
