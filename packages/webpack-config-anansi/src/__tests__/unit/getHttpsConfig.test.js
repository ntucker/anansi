const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const getHttpsConfig = require('../../getHttpsConfig').default;

describe('getHttpsConfig', () => {
  const env = process.env;
  // ignore any HTTPS/SSL_* set in the shell running the tests
  const baseEnv = { ...env };
  delete baseEnv.HTTPS;
  delete baseEnv.SSL_CRT_FILE;
  delete baseEnv.SSL_KEY_FILE;
  afterEach(() => {
    process.env = env;
  });

  it.each([
    [{}, 'http'],
    [{ HTTPS: 'true' }, { type: 'https' }],
  ])('%j -> %j', (vars, expected) => {
    process.env = { ...baseEnv, ...vars };
    expect(getHttpsConfig(__dirname)).toEqual(expected);
  });

  it('returns the provided cert files with the https type', () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'anansi-https-'));
    const key = privateKey.export({ type: 'pkcs8', format: 'pem' });
    // publicEncrypt accepts the public key, so it stands in for the cert
    const cert = publicKey.export({ type: 'spki', format: 'pem' });
    fs.writeFileSync(path.join(dir, 'key.pem'), key);
    fs.writeFileSync(path.join(dir, 'cert.pem'), cert);
    process.env = {
      ...baseEnv,
      HTTPS: 'true',
      SSL_CRT_FILE: 'cert.pem',
      SSL_KEY_FILE: 'key.pem',
    };
    try {
      const config = getHttpsConfig(dir);
      expect(config.type).toBe('https');
      expect(config.options.key.toString()).toBe(key);
      expect(config.options.cert.toString()).toBe(cert);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
