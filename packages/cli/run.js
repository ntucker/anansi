#!/usr/bin/env node
const fs = require('fs');
const execa = require('execa');
const path = require('path');
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
  .action(async (projectName, options) => {
    if (!options.dir) {
      if (!fs.existsSync(projectName)) {
        fs.mkdirSync(projectName);
      }
    }
    try {
      const cwd = options.dir || `./${projectName}`;
      await execa('npx yo', ['@anansi/js', projectName], {
        stdio: 'inherit',
        shell: true,
        cwd,
        env: {
          PATH: `${process.env.PATH}:${__dirname}/node_modules/.bin`,
        },
      });
      console.log('\nProject setup complete! Opening editor now...');
      await execa('"${VISUAL:-code}"', [cwd, path.join(cwd, 'README.md')], {
        shell: true,
      });
    } catch (error) {
      console.error(error.message);
      process.exit(2);
    }
  });

program
  .command('add <features...>')
  .description('adds features to existing project', {
    features: 'one of `testing` | `storybook` | `circle` | `github-actions`',
  })
  .action(async features => {
    for (const feature of features) {
      try {
        await execa('npx yo', [`@anansi/js:${feature}`], {
          stdio: 'inherit',
          shell: true,
          env: {
            PATH: `${process.env.PATH}:${__dirname}/node_modules/.bin`,
          },
        });
      } catch (error) {
        console.error(error.message);
        process.exit(2);
      }
    }
  });

program.parse(process.argv);
