/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Ensure the certificate and key provided are valid and if not
// throw an easy to debug error
function validateKeyAndCerts({ cert, key, keyFile, crtFile }) {
  let encrypted;
  try {
    // publicEncrypt will throw an error with an invalid cert
    encrypted = crypto.publicEncrypt(cert, Buffer.from('test'));
  } catch (err) {
    throw new Error(`The certificate "${crtFile}" is invalid.\n${err.message}`);
  }

  try {
    // privateDecrypt will throw an error with an invalid key
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    throw new Error(
      `The certificate key "${keyFile}" is invalid.\n${err.message}`,
    );
  }
}

// Read file and throw an error if it doesn't exist
function readEnvFile(file, type) {
  if (!fs.existsSync(file)) {
    throw new Error(
      `You specified ${type} in your env, but the file "${file}" can't be found.`,
    );
  }
  return fs.readFileSync(file);
}

// HTTP/1.1 over TLS on every webpack-dev-server version: 6.0.0 removed spdy,
// and its http2 type crashes on the first request
const TLS_SERVER_TYPE = 'https';

// Get the https config
// Return cert files if provided in env, otherwise just true or false
export default function getHttpsConfig(rootPath) {
  const { SSL_CRT_FILE, SSL_KEY_FILE, HTTPS } = process.env;
  const isHttps = HTTPS === 'true';

  if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
    const crtFile = path.resolve(rootPath, SSL_CRT_FILE);
    const keyFile = path.resolve(rootPath, SSL_KEY_FILE);
    const config = {
      cert: readEnvFile(crtFile, 'SSL_CRT_FILE'),
      key: readEnvFile(keyFile, 'SSL_KEY_FILE'),
    };

    validateKeyAndCerts({ ...config, keyFile, crtFile });
    return {
      type: TLS_SERVER_TYPE,
      options: config,
    };
  }
  return isHttps ? { type: TLS_SERVER_TYPE } : 'http';
}
