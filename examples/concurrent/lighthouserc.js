module.exports = {
  ci: {
    collect: {
      // collect options here
      //staticDistDir: 'dist',
      //isSinglePageApplication: true,
      startServerCommand: 'yarn start:server -ap',
      startServerReadyPattern: 'Listening at',
      url: [
        'http://localhost:8080',
        'http://localhost:8080/user/6',
        'http://localhost:8080/post/51',
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
