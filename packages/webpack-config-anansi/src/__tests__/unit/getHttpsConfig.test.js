const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const getHttpsConfig = require('../../getHttpsConfig').default;

describe('getHttpsConfig', () => {
  const env = process.env;
  afterEach(() => {
    process.env = env;
  });

  it.each([
    [{}, 'http'],
    [{ HTTPS: 'true' }, { type: 'https' }],
  ])('%j -> %j', (vars, expected) => {
    process.env = { ...env, ...vars };
    expect(getHttpsConfig(__dirname)).toEqual(expected);
  });

  it('serves https with the provided cert files', () => {
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
      ...env,
      HTTPS: 'true',
      SSL_CRT_FILE: 'cert.pem',
      SSL_KEY_FILE: 'key.pem',
    };
    const config = getHttpsConfig(dir);
    expect(config.type).toBe('https');
    expect(config.options.key.toString()).toBe(key);
    expect(config.options.cert.toString()).toBe(cert);
  });
});
