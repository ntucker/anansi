#!/usr/bin/env node
const spawn = require('cross-spawn');
const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .command('hatch <projectName>')
  .description('creates a new anansi project', {
    projectName: 'Package name for the project',
  })
  .option(
    '-d, --dir <directory>',
    'What directory to add to. (Creates new directory by default)',
  )
  .action((projectName, options) => {
    const { status } = spawn.sync('which', ['yo']);
    if (status !== 0) {
      console.error('You need to install `yo` package globally');
      console.error('Try `npm install -g yo`');
      process.exit(1);
    }

    if (!options.dir) {
      if (!fs.existsSync(projectName)) {
        fs.mkdirSync(projectName);
      }
    }
    spawn.sync('yo', ['@anansi/js'].concat(projectName), {
      stdio: 'inherit',
      cwd: options.dir || `./${projectName}`,
    });
  });

program
  .command('add <features...>')
  .description('adds features to existing project', {
    features: 'one of `testing` | `storybook` | `circle` | `github-actions`',
  })
  .action(features => {
    const { status } = spawn.sync('which', ['yo']);
    if (status !== 0) {
      console.error('You need to install `yo` package globally');
      console.error('Try `npm install -g yo`');
      process.exit(1);
    }

    features.forEach(feature => {
      spawn.sync('yo', [`@anansi/js:${feature}`], {
        stdio: 'inherit',
      });
    });
  });

program.parse(process.argv);
