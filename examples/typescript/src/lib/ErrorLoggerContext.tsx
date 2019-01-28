import React from 'react';

const ErrorLoggerContext = React.createContext(
  (error: Error, { errorInfo }: { errorInfo: object }) => console.error(error),
);
export default ErrorLoggerContext;
