const {
  dismissRuntimeErrors,
  reportRuntimeError,
  reportBuildError,
  dismissBuildError,
} =
  typeof window !== 'undefined' ?
    require('react-error-overlay')
  : {
      dismissRuntimeErrors: () => {},
      reportRuntimeError: () => {},
      dismissBuildError: () => {},
      reportBuildError: () => {},
    };

module.exports = {
  clearRuntimeErrors: dismissRuntimeErrors,
  handleRuntimeError: reportRuntimeError,
  showCompileError: reportBuildError,
  clearCompileError: dismissBuildError,
};
