const idObj = new Proxy(
  {},
  {
    get: function getter(target, key) {
      if (key === '__esModule') {
        return true;
      }
      return key;
    },
  },
);

module.exports = idObj;
