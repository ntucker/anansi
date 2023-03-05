#!/usr/bin/env node
import { Command } from 'commander';
import { execa } from 'execa';
import fs from 'fs';
import { resolve } from 'import-meta-resolve';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// TODO: Use this once stackblitz works with it
//import pkg from './package.json' assert { type: 'json' };
import { verifyAndPrompt } from './check-version.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, './package.json'), 'utf8'),
);
const { version } = pkg;

const program = new Command();

program.version(version);

program
  .command('hatch')
  .alias('init')
  .description('creates a new anansi project')
  .argument('<projectName>', 'Package name for the project')
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
      const yosub = execa(
        'npx yo',
        [
          // get rid of 'file://' prefix
          (await resolve('@anansi/generator-js', import.meta.url)).substring(7),
          projectName,
        ],
        {
          stdio: ['pipe', process.stdout, process.stderr],
          shell: true,
          cwd,
          env: {
            PATH: `${process.env.PATH}:${__dirname}/node_modules/.bin`,
          },
        },
      );
      // pipe with raw mode allows us to know when this exits with Ctrl+C (SIGINT)
      process.stdin.setRawMode(true);
      process.stdin.pipe(yosub.stdin, { end: false });
      await Promise.all([verifyAndPrompt(), yosub]);

      const readme = path.join(cwd, 'README.md');
      // if user exits early this is still exit code 0, so we need to validate
      // whether the setup completed before going on to the next step
      if (!fs.existsSync(readme)) {
        process.exit(2);
      }
      let editor = process.env.REACT_EDITOR || process.env.VISUAL || 'code';
      try {
        await execa('which', [`"${editor}"`], {
          shell: true,
        });
      } catch (e) {
        console.error(
          'No visual editor found...skipping editor launch.\n(Set $VISUAL env variable to automatically launch editor upon new project setup)',
        );
        editor = false;
      }
      if (editor) {
        console.log('\nProject setup complete! Opening editor now...');
        await execa(`"${editor}"`, [cwd, readme], {
          shell: true,
          stdio: 'inherit',
        });
      }
    } catch (error) {
      // Don't display error for user-triggered exit (SIGINT)
      if (error.exitCode !== 130) console.error(error.message);
      process.exit(2);
    }
  });

program
  .command('add')
  .description('adds features to existing project')
  .argument(
    '<features...>',
    'one of `testing` | `storybook` | `circle` | `github-actions`',
  )
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

program
  .command('serve')
  .description('runs server for SSR projects')
  .argument('<entrypath>', 'Path to entrypoint')
  .option('--pubPath <path>', 'Where to serve assets from')
  .option(
    '-d, --dev',
    'Run devserver rather than using previously compiled output',
  )
  .option('-a, --serveAssets', '[non-dev] also serves client assets')
  .option('-p, --serveProxy', '[non-dev] uses webpack proxy config')
  .action(async (entrypath, options) => {
    try {
      const { serve, devServe } = await import('@anansi/core/scripts');

      if (options.pubPath) process.env.WEBPACK_PUBLIC_PATH = options.pubPath;
      else if (!process.env.WEBPACK_PUBLIC_PATH)
        process.env.WEBPACK_PUBLIC_PATH = options.dev ? '/assets/' : '/';

      if (options.dev) {
        devServe(entrypath);
      } else {
        serve(entrypath, options);
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'ERR_MODULE_NOT_FOUND') {
        console.error('@anansi/core must be installed to run this subcommand');
      } else {
        console.error(error.message);
      }
      process.exit(2);
    }
  });

program.parse(process.argv);
