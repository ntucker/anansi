import {
  DEFAULT_ASSET_PATH,
  DEFAULT_ROOT_PATH,
  DEFAULT_SERVER_PATH,
} from '../defaults';
import { BetterGenerator } from '../utils';

interface Options {
  appName: string;
  githubDomain: string;
  'root-path': string;
  'build-path': string;
  'server-path': string;
  'npm-namespace': string;
}

export default class extends BetterGenerator<Options> {
  constructor(args: string | string[], options: Options, features: Options) {
    super(args, options, features);

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
    this.option('server-path', {
      alias: 's',
      description: 'Server build destination',
      type: String,
      default: DEFAULT_SERVER_PATH,
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
    if (this.options['server-path']) {
      this.config.set('serverPath', this.options['server-path']);
    } else if (!this.config.get('serverPath')) {
      this.config.set('serverPath', DEFAULT_ASSET_PATH);
    }
    this.config.set('appName', this.options.appName);
    this.config.set('githubDomain', this.options.githubDomain ?? 'github.com');
    this.config.set('npmNamespace', this.options['npm-namespace']);
  }

  async prompting() {
    const prompts = [
      {
        type: 'list',
        name: 'projectType',
        message: 'Would type of project are you starting?',
        default: 'SPA',
        choices: [
          {
            name: 'Website',
            value: 'SPA',
          },
          {
            name: 'NPM package',
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
    ] as const;

    const props = await this.prompt(prompts);

    this.config.set('githubOrg', props.githubOrg);
    return props;
  }
}
