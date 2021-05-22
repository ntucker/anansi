#!/usr/bin/env node
const fs = require('fs');
const execa = require('execa');
const path = require('path');
const { Command } = require('commander');

const { verifyAndPrompt } = require('./check-version');
const { version } = require('./package.json');

const program = new Command();

program.version(version);

program
  .command('hatch <projectName>')
  .alias('init')
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
      await Promise.all([
        verifyAndPrompt(),
        execa('npx yo', ['@anansi/js', projectName], {
          stdio: 'inherit',
          shell: true,
          cwd,
          env: {
            PATH: `${process.env.PATH}:${__dirname}/node_modules/.bin`,
          },
        }),
      ]);
      const readme = path.join(cwd, 'README.md');
      // if user exits early this is still exit code 0, so we need to validate
      // whether the setup completed before going on to the next step
      if (!fs.existsSync(readme)) {
        process.exit(2);
      }
      let editor = true;
      try {
        await execa('which', ['"${VISUAL:-code}"'], { shell: true });
      } catch (e) {
        console.error(
          'No visual editor found...skipping editor launch.\n(Set $VISUAL env variable to automatically launch editor upon new project setup)',
        );
        editor = false;
      }
      if (editor) {
        console.log('\nProject setup complete! Opening editor now...');
        await execa('"${VISUAL:-code}"', [cwd, readme], {
          shell: true,
        });
      }
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
    await verifyAndPrompt();

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
