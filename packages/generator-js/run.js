#!/usr/bin/env node
const spawn = require('cross-spawn');
const fs = require('fs');

const args = process.argv.slice(2);
const app = args[0];

if (!app) {
  console.error('You must specify app name');
  process.exit(1);
}

const { status } = spawn.sync('which', ['yo']);
if (status !== 0) {
  console.error('You need to install `yo` package globally');
  process.exit(1);
}

if (!fs.existsSync(app)) {
  fs.mkdirSync(app);
}
spawn.sync('yo', ['@anansi/js'].concat(args), {
  stdio: 'inherit',
  cwd: `./${app}`,
});
