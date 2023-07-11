/* global __react_refresh_socket__, __resourceQuery */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/webpackHotDevClient.js
 */

// This is adapted to hook create-react-app directly into react-refresh's existing socket connections

var runWithPatchedUrl = require('@pmmmwh/react-refresh-webpack-plugin/client/utils/patchUrl');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
var launchEditorEndpoint = require('react-dev-utils/launchEditorEndpoint');
var ErrorOverlay = require('react-error-overlay');
var stripAnsi = require('strip-ansi');

ErrorOverlay.setEditorHandler(function editorHandler(errorLocation) {
  // Keep this sync with errorOverlayMiddleware.js
  fetch(
    launchEditorEndpoint +
      '?fileName=' +
      window.encodeURIComponent(errorLocation.fileName) +
      '&lineNumber=' +
      window.encodeURIComponent(errorLocation.lineNumber || 1) +
      '&colNumber=' +
      window.encodeURIComponent(errorLocation.colNumber || 1),
  );
});

// Don't show overlay for certain errors as they are disruptive
if (typeof window !== 'undefined') {
  window.addEventListener('error', e => {
    if (
      e.message.includes(
        'The server could not finish this Suspense boundary',
      ) ||
      e.status
    ) {
      e.stopImmediatePropagation();
    }
  });
}

// We need to keep track of if there has been a runtime error.
// Essentially, we cannot guarantee application state was not corrupted by the
// runtime error. To prevent confusing behavior, we forcibly reload the entire
// application. This is handled below when we are notified of a compile (code
// change).
// See https://github.com/facebook/create-react-app/issues/3096
var hadRuntimeError = false;
ErrorOverlay.startReportingRuntimeErrors({
  onError: function () {
    hadRuntimeError = true;
  },
  filename: '/App.js',
});

if (module.hot && typeof module.hot.dispose === 'function') {
  module.hot.dispose(function () {
    // TODO: why do we need this?
    ErrorOverlay.stopReportingRuntimeErrors();
  });
}

// Remember some state related to hot module replacement.
var isFirstCompilation = true;
var mostRecentCompilationHash = null;
var hasCompileErrors = false;

function clearOutdatedErrors() {
  // Clean up outdated compile errors, if any.
  if (typeof console !== 'undefined' && typeof console.clear === 'function') {
    if (hasCompileErrors) {
      console.clear();
    }
  }
}

// Successful compilation.
function handleSuccess() {
  clearOutdatedErrors();

  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    tryApplyUpdates(function onHotUpdateSuccess() {
      // Only dismiss it when we're sure it's a hot update.
      // Otherwise it would flicker right before the reload.
      tryDismissErrorOverlay();
    });
  }
}

// Compilation with warnings (e.g. ESLint).
function handleWarnings(warnings) {
  clearOutdatedErrors();

  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  function printWarnings() {
    // Print warnings to the console.
    var formatted = formatWebpackMessages({
      warnings: warnings.map(errorObjOrMessage =>
        [errorObjOrMessage.moduleName, errorObjOrMessage.message].join('\n'),
      ),
      errors: [],
    });

    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      for (var i = 0; i < formatted.warnings.length; i++) {
        if (i === 5) {
          console.warn(
            'There were more warnings in other files.\n' +
              'You can find a complete log in the terminal.',
          );
          break;
        }
        console.warn(stripAnsi(formatted.warnings[i]));
      }
    }
  }

  printWarnings();

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    tryApplyUpdates(function onSuccessfulHotUpdate() {
      // Only dismiss it when we're sure it's a hot update.
      // Otherwise it would flicker right before the reload.
      tryDismissErrorOverlay();
    });
  }
}

// Compilation with errors (e.g. syntax error or missing modules).
function handleErrors(errors) {
  clearOutdatedErrors();

  isFirstCompilation = false;
  hasCompileErrors = true;

  // "Massage" webpack messages.
  var formatted = formatWebpackMessages({
    errors: errors.map(errorObjOrMessage =>
      [errorObjOrMessage.moduleName, errorObjOrMessage.message].join('\n'),
    ),
    warnings: [],
  });

  // Only show the first error.
  ErrorOverlay.reportBuildError(formatted.errors[0]);

  // Also log them to the console.
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    for (var i = 0; i < formatted.errors.length; i++) {
      console.error(stripAnsi(formatted.errors[i]));
    }
  }

  // Do not attempt to reload now.
  // We will reload on next success instead.
}

function tryDismissErrorOverlay() {
  if (!hasCompileErrors) {
    ErrorOverlay.dismissBuildError();
  }
}

// There is a newer version of the code available.
function handleAvailableHash(hash) {
  // Update last known compilation hash.
  mostRecentCompilationHash = hash;
}

// Handle messages from the server.
function compileMessageHandler(message) {
  switch (message.type) {
    case 'hash':
      handleAvailableHash(message.data);
      break;
    case 'still-ok':
    case 'ok':
      handleSuccess();
      break;
    case 'content-changed':
      // Triggered when a file from `contentBase` changed.
      window.location.reload();
      break;
    case 'warnings':
      handleWarnings(message.data);
      break;
    case 'errors':
      handleErrors(message.data);
      break;
    default:
    // Do nothing.
  }
}

// Is there a newer version of this code available?
function isUpdateAvailable() {
  /* globals __webpack_hash__ */
  // __webpack_hash__ is the hash of the current compilation.
  // It's a global variable injected by webpack.
  return mostRecentCompilationHash !== __webpack_hash__;
}

// webpack disallows updates in other states.
function canApplyUpdates() {
  return module.hot.status() === 'idle';
}

function canAcceptErrors() {
  // NOTE: This var is injected by Webpack's DefinePlugin, and is a boolean instead of string.
  const hasReactRefresh = process.env.FAST_REFRESH;

  const status = module.hot.status();
  // React refresh can handle hot-reloading over errors.
  // However, when hot-reload status is abort or fail,
  // it indicates the current update cannot be applied safely,
  // and thus we should bail out to a forced reload for consistency.
  return hasReactRefresh && ['abort', 'fail'].indexOf(status) === -1;
}

// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onHotUpdateSuccess) {
  if (!module.hot) {
    // HotModuleReplacementPlugin is not in webpack configuration.
    window.location.reload();
    return;
  }

  // we know it's hot, so dismiss error
  if (typeof onHotUpdateSuccess === 'function') {
    onHotUpdateSuccess();
  }

  if (!isUpdateAvailable() || !canApplyUpdates()) {
    return;
  }

  function handleApplyUpdates(err, updatedModules) {
    const haveErrors = err || hadRuntimeError;
    // When there is no error but updatedModules is unavailable,
    // it indicates a critical failure in hot-reloading,
    // e.g. server is not ready to serve new bundle,
    // and hence we need to do a forced reload.
    const needsForcedReload = !err && !updatedModules;
    if ((haveErrors && !canAcceptErrors()) || needsForcedReload) {
      window.location.reload();
      return;
    }

    if (typeof onHotUpdateSuccess === 'function') {
      // Maybe we want to do something.
      onHotUpdateSuccess();
    }

    if (isUpdateAvailable()) {
      // While we were updating, there was a new update! Do it again.
      tryApplyUpdates();
    }
  }

  // https://webpack.github.io/docs/hot-module-replacement.html#check
  var result = module.hot.check(/* autoApply */ true, handleApplyUpdates);

  // // webpack 2 returns a Promise instead of invoking a callback
  if (result && result.then) {
    result.then(
      function (updatedModules) {
        handleApplyUpdates(null, updatedModules);
      },
      function (err) {
        handleApplyUpdates(err, null);
      },
    );
  }
}

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  runWithPatchedUrl(function setupOverlay() {
    // Only register if no other overlay have been registered
    if (!window.__reactRefreshOverlayInjected && __react_refresh_socket__) {
      // Registers handlers for compile errors with retry -
      // This is to prevent mismatching injection order causing errors to be thrown
      runWithRetry(function initSocket() {
        __react_refresh_socket__.init(compileMessageHandler, __resourceQuery);
      }, 3);
      // Registers handlers for runtime errors
      /*handleError(function handleError(error) {
        hasRuntimeErrors = true;
        __react_refresh_error_overlay__.handleRuntimeError(error);
      });
      handleUnhandledRejection(function handleUnhandledPromiseRejection(error) {
        hasRuntimeErrors = true;
        __react_refresh_error_overlay__.handleRuntimeError(error);
      });*/

      // Mark overlay as injected to prevent double-injection
      window.__reactRefreshOverlayInjected = true;
    }
  });
}
function runWithRetry(callback, maxRetries) {
  function executeWithRetryAndTimeout(currentCount) {
    try {
      if (currentCount > maxRetries - 1) {
        console.warn('[React Refresh] Failed set up the socket connection.');
        return;
      }

      callback();
    } catch (err) {
      setTimeout(
        function () {
          executeWithRetryAndTimeout(currentCount + 1);
        },
        Math.pow(10, currentCount),
      );
    }
  }

  executeWithRetryAndTimeout(0);
}
