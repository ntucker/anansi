#!/usr/bin/env node
import { spawn } from 'child_process';

try {
  const child = spawn('npx', ['-y', 'yo', '--version'], {
    stdio: 'ignore',
    detached: true,
    shell: true,
    windowsHide: true,
  });
  child.on('error', () => {});
  child.unref();
} catch (e) {
  // Pre-caching is optional
}
