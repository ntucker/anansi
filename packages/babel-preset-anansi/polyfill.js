require('@babel/polyfill')
global.requestIdleCallback = require('ric-shim')
global.cancelIdleCallback = global.requestIdleCallback.cancelIdleCallback
