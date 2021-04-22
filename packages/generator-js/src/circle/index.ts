import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class extends InstallPeersMixin(BetterGenerator) {
  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);

    this.option('circle-parallelism', {
      alias: 'p',
      description: 'Level of parallelism to run circleci',
      type: Number,
      default: 1,
    });

    const { githubOrg, appName, badges = '' } = this.config.getAll();
    this.config.set(
      'badges',
      `[![CircleCI](https://circleci.com/gh/${githubOrg}/${appName}.svg?style=shield)](https://circleci.com/gh/${githubOrg}/${appName})
${badges}`,
    );
  }

  configuring() {
    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationRoot(),
      {
        nodeImage: this.options.nodeImage ?? 'circleci/node:14',
        circleParallelism: this.options['circle-parallelism'],
        ...this.config.getAll(),
      },
      {},
      { globOptions: { dot: true } },
    );
  }
};
