const findCacheDir = require('find-cache-dir');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mkdirp = require('mkdirp');

const hashFileName = name => {
  const hash = crypto.createHash('md4');
  hash.update(name);
  return hash.digest('hex');
};

class LinariaFileCache {
  constructor() {
    const linariaCacheDir = findCacheDir({
      name: `.linaria-${process.env.NODE_ENV}`,
      cwd: process.cwd(),
    });
    if (!linariaCacheDir) {
      throw new Error('Get linaria cache dir failed');
    }
    mkdirp.sync(linariaCacheDir);
    this.linariaCacheDir = linariaCacheDir;
  }

  async get(key) {
    return fs.promises.readFile(
      path.join(this.linariaCacheDir, `${hashFileName(key)}.linaria.css`),
      'utf8',
    );
  }

  async set(key, value) {
    return fs.promises.writeFile(
      path.join(this.linariaCacheDir, `${hashFileName(key)}.linaria.css`),
      value,
      'utf8',
    );
  }
}

module.exports = new LinariaFileCache();
