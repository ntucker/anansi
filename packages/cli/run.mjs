#!/usr/bin/env node
import { Command } from 'commander';
import { execa } from 'execa';
import fs from 'fs';
import { resolve } from 'import-meta-resolve';
import { createRequire } from 'module';
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
      // get rid of 'file://' prefix
      const generatorPath = resolve(
        '@anansi/generator-js',
        import.meta.url,
      ).substring(7);
      const yosub = execa('npx yo', [generatorPath, projectName], {
        stdio: ['pipe', process.stdout, process.stderr],
        shell: true,
        cwd,
        env: {
          PATH: `${process.env.PATH}:${__dirname}/node_modules/.bin`,
        },
      });
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

// each package ships a guide.md for its own version; read the project's copy
const guidePackages = {
  app: '@anansi/webpack-config',
  ssr: '@anansi/core',
  library: '@anansi/babel-preset',
  testing: '@anansi/jest-preset',
  lint: '@anansi/eslint-plugin',
};
const guideTopics = ['overview', ...Object.keys(guidePackages)];

// looks in node_modules directly so packages whose exports hide package.json still resolve
function resolveProjectPackage(name) {
  const lookupPaths = createRequire(
    path.join(process.cwd(), 'package.json'),
  ).resolve.paths(name);
  const dir = lookupPaths
    .map(modulesDir => path.join(modulesDir, name))
    .find(candidate => fs.existsSync(path.join(candidate, 'package.json')));
  if (!dir) return undefined;
  const { version } = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'), 'utf8'),
  );
  return { dir, version };
}

function renderOverview() {
  const topicLines = Object.entries(guidePackages).map(([topic, name]) => {
    const installed = resolveProjectPackage(name);
    const status = installed ? `@${installed.version}` : ' (not installed)';
    return `- ${topic}: ${name}${status}`;
  });
  return [
    fs.readFileSync(path.join(__dirname, 'guide.md'), 'utf8'),
    '## Topics\n',
    "Run `anansi guide <topic...>` for the area you're changing. Each guide comes",
    'from the version installed in this project.\n',
    ...topicLines,
  ].join('\n');
}

function renderTopic(topic) {
  if (topic === 'overview') return renderOverview();
  const name = guidePackages[topic];
  const installed = resolveProjectPackage(name);
  if (!installed) {
    return `# ${topic}\n\n${name} isn't installed in this project. Install it, then rerun \`anansi guide ${topic}\`.\n`;
  }
  const guidePath = path.join(installed.dir, 'guide.md');
  if (!fs.existsSync(guidePath)) {
    return `# ${topic}\n\n${name}@${installed.version} predates guides; read ${path.join(installed.dir, 'README.md')}\n`;
  }
  return fs.readFileSync(guidePath, 'utf8');
}

program
  .command('guide')
  .description('prints how to use anansi, written for AI agents')
  .argument('[topics...]', `any of: ${guideTopics.join(' | ')}`, ['overview'])
  .action(topics => {
    const unknown = topics.filter(topic => !guideTopics.includes(topic));
    if (unknown.length) {
      console.error(
        `Unknown guide topic: ${unknown.join(', ')}\nAvailable: ${guideTopics.join(', ')}`,
      );
      process.exit(1);
    }
    console.log(topics.map(renderTopic).join('\n'));
  });

program.parse(process.argv);
