'use strict';

const wrapper = require('./utils/wrapper');

module.exports = {
  process(src, filename, config, options) {
    let lang;
    let transformer;
    if (/^.+\.[t]sx?$/.test(filename)) {
      lang = 'ts';
      transformer = require('ts-jest').createTransformer();
    } else {
      lang = 'js';
      transformer = require('babel-jest');
    }
    const wrappedSrc = wrapper.wrapSource(src, lang);
    return transformer.process(wrappedSrc, filename, config, {
      ...options,
      instrument: false,
    });
  },
};
