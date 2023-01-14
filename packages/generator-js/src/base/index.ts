import { ConfigureGenerator } from '../app';
import { InstallPeersMixin } from '../utils';

export default class extends InstallPeersMixin(ConfigureGenerator) {
  initializing() {
    super.initializing();
    // default until testing is set
    this.config.set('testing', false);
  }

  async prompting() {
    const prompts = [
      {
        type: 'checkbox',
        name: 'features',
        message: 'What features would you like to include?',
        choices: [
          { name: 'storybook', value: 'storybook' },
          { name: 'testing (Jest)', value: 'testing' },
          { name: 'Continuous Integration', value: 'CI' },
        ] as { name: string; value: string }[],
        default: ['SSR', 'testing', 'CI'] as string[],
        store: true,
      },
    ] as const;
    if (this.options.projectType === 'SPA') {
      prompts[0].choices.unshift({
        name: 'Server Side Rendering',
        value: 'SSR',
      });
      prompts[0].default.unshift('SSR');
    }

    const props = await this.prompt(prompts);
    this.config.set('features', props.features);

    if (props.features.includes('CI')) {
      this.composeWith(require.resolve('../circle'), this.options);
      if (this.options.projectType === 'SPA') {
        this.composeWith(require.resolve('../github-actions'), this.options);
      }
    }
    if (props.features.includes('testing')) {
      this.composeWith(require.resolve('../testing'), this.options);
    }
    if (this.options.projectType === 'SPA') {
      this.composeWith(require.resolve('../spa'), this.options);
    } else {
      this.composeWith(require.resolve('../library'), this.options);
    }
    if (props.features.includes('storybook')) {
      this.composeWith(require.resolve('../storybook'), this.options);
    }
    return props;
  }

  configuring() {
    this.composeWith(require.resolve('../license'), {
      ...this.options,
      defaultLicense: 'BSD',
    });

    const repository = `${this.config.get('githubDomain')}/${this.config.get(
      'githubOrg',
    )}/${this.config.get('appName')}`;
    const namespace = this.config.get('npmNamespace')
      ? `${this.config.get('npmNamespace')}/`
      : '';
    const packageSettings = {
      name: `${namespace}${this.config.get('appName')}`,
      version: '0.0.1',
      packageManager: 'yarn@3.1.1',
      description: `${this.config.get('appName')} - An Anansi project`,
      scripts: {
        lint: `eslint ${this.config.get('rootPath')} --ext .ts,.tsx`,
        format: 'npm run lint --fix',
        'test:type': 'tsc',
      },
      repository: {
        type: 'git',
        url: `git+ssh://git@${repository}.git`,
      },
      bugs: {
        url: `https://${repository}/issues`,
      },
      homepage: `https://${repository}#readme`,
      keywords: ['anansi'],
      author: this.config.get('author'),
    };
    this.packageJson.merge(packageSettings);

    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationRoot(),
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
    // set .gitignore to proper location
    this.fs.move(
      this.destinationPath('.gitignore.tpl'),
      this.destinationPath('.gitignore'),
    );
    // set .yarnrc.yml to proper location
    this.fs.move(
      this.destinationPath('.yarnrc.yml.tpl'),
      this.destinationPath('.yarnrc.yml'),
    );
  }

  async configuringLinterPackages() {
    await this.addPeers(
      '@anansi/eslint-plugin',
      ['typescript', 'babel-plugin-root-import', 'webpack'],
      'devDependencies' as const,
    );

    await this.addDevDependencies([
      '@babel/core',
      '@anansi/babel-preset',
      '@anansi/eslint-plugin',
      '@anansi/browserslist-config',
      'typescript',
    ]);
    await this.addDependencies(['@babel/runtime']);
  }
}
