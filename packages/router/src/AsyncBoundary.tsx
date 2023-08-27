import { useLocation } from '@pojo-router/core';
import React, { memo, Suspense } from 'react';

import ErrorBoundary from './ErrorBoundary.js';
import type { ErrorTypes } from './types.js';

/**
 * Handles loading and error conditions of Suspense
 */
function AsyncBoundary({
  children,
  errorComponent,
  fallback,
  ...errorProps
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorClassName?: string;
  errorComponent?: React.ComponentType<{
    error: ErrorTypes;
    className?: string;
  }>;
  className?: string;
}): JSX.Element {
  const location = useLocation();
  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary
        key={location.pathname + location.search}
        {...errorProps}
        fallbackComponent={errorComponent}
      >
        {children}
      </ErrorBoundary>
    </Suspense>
  );
}
export default memo(AsyncBoundary) as typeof AsyncBoundary;
