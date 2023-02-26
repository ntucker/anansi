import { useContext, useState, useEffect } from 'react';

import { IsLoadingContext } from './IsLoadingContext.js';

export default function useShowLoading(timeout = 100) {
  const isLoading = useContext(IsLoadingContext);
  const [sufficientTime, setSufficientTime] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setSufficientTime(false);
      return;
    }
    const handle = setTimeout(() => setSufficientTime(true), timeout);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  return isLoading && sufficientTime;
}
