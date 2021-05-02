#!/usr/bin/env node
const spawn = require('cross-spawn');
const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .command('hatch [projectName]')
  .description('creates a new anansi project')
  .option('-s, --setup_mode <mode>', 'Which setup mode to use', 'normal')
  .action((projectName, options) => {
    if (!projectName) {
      console.error('You must specify app name');
      process.exit(1);
    }

    const { status } = spawn.sync('which', ['yo']);
    if (status !== 0) {
      console.error('You need to install `yo` package globally');
      process.exit(1);
    }

    if (!fs.existsSync(projectName)) {
      fs.mkdirSync(projectName);
    }
    spawn.sync('yo', ['@anansi/js'].concat(projectName), {
      stdio: 'inherit',
      cwd: `./${projectName}`,
    });
  });

program.parse(process.argv);
