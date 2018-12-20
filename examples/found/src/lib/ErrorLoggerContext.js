import React from 'react'

const ErrorLoggerContext = React.createContext((error, { errorInfo }) =>
  console.error(error),
)
export default ErrorLoggerContext