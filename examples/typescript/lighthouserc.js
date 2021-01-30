module.exports = {
  ci: {
    collect: {
      // collect options here
      staticDistDir: 'dist',
      isSinglePageApplication: true,
      url: [
        'http://localhost',
        'http://localhost/issues',
        'http://localhost/post/1',
      ],
    },
    upload: {
      // upload options here
      target: 'temporary-public-storage',
    },
    server: {
      // server options here
    },
    wizard: {
      // wizard options here
    },
  },
};
