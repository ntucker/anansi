import Generator from 'yeoman-generator';

import { DEFAULT_ASSET_PATH, DEFAULT_ROOT_PATH } from '../defaults';

export default class extends Generator {
  constructor(args: string | string[], options: {}) {
    super(args, options);

    this.argument('appName', { type: String, required: true });
    this.option('root-path', {
      alias: 'r',
      description: 'Path for all the source files',
      type: String,
      default: DEFAULT_ROOT_PATH,
    });
    this.option('build-path', {
      alias: 'b',
      description: 'Build destination',
      type: String,
      default: DEFAULT_ASSET_PATH,
    });
    this.option('npm-namespace', {
      alias: 'n',
      description: 'NPM namespace like @anansi (be sure to include the @)',
      type: String,
    });
  }

  initializing() {
    if (this.options['root-path']) {
      this.config.set('rootPath', this.options['root-path']);
    } else if (!this.config.get('rootPath')) {
      this.config.set('rootPath', DEFAULT_ROOT_PATH);
    }
    if (this.options['build-path']) {
      this.config.set('assetPath', this.options['build-path']);
    } else if (!this.config.get('assetPath')) {
      this.config.set('assetPath', DEFAULT_ASSET_PATH);
    }
    this.config.set('appName', this.options.appName);
    this.config.set('githubDomain', this.options.githubDomain ?? 'github.com');
    this.config.set('npmNamespace', this.options['npm-namespace']);
  }

  async prompting() {
    const prompts: Array<Generator.Question> = [
      {
        type: 'list',
        name: 'projectType',
        message: 'Would type of project are you starting?',
        default: 'SPA',
        choices: [
          {
            name: 'Application',
            value: 'SPA',
          },
          {
            name: 'Library',
            value: 'library',
          },
        ],
        store: true,
      },
      {
        type: 'input',
        name: 'githubOrg',
        message:
          'What github org or username? (this does not modify github in any way)',
        default: this.config.get('githubOrg'),
        store: true,
      },
    ];

    const props = await this.prompt(prompts);

    this.config.set('githubOrg', props.githubOrg);
    return props;
  }
}
