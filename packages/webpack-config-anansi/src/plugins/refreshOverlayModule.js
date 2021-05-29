const {
  dismissRuntimeErrors,
  reportRuntimeError,
  reportBuildError,
  dismissBuildError,
} = require('react-error-overlay');

module.exports = {
  clearRuntimeErrors: dismissRuntimeErrors,
  handleRuntimeError: reportRuntimeError,
  showCompileError: reportBuildError,
  clearCompileError: dismissBuildError,
};
