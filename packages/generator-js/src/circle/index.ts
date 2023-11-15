import { BaseFeatures, BaseOptions } from 'yeoman-generator';

import { BetterGenerator } from '../utils.js';

export default class CircleGenerator<
  O extends CircleOptions = CircleOptions,
  F extends BaseFeatures = BaseFeatures,
> extends BetterGenerator<O, F> {
  constructor(args: string | string[], options: O, features: F) {
    super(args, options, features);

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
        nodeImage: this.options.nodeImage ?? 'circleci/node:16',
        circleParallelism: this.options['circle-parallelism'],
        ...this.config.getAll(),
      },
      {},
      { globOptions: { dot: true } },
    );
  }
}

type CircleOptions = BaseOptions & {
  'circle-parallelism': number;
  nodeImage?: string;
};
