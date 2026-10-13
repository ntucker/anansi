import { passthrough } from '@yeoman/transform';
import chalk from 'chalk';
import { format, type Options } from 'prettier';
import shelobsay from 'shelobsay';
import { BaseFeatures } from 'yeoman-generator';

import ConfigureGenerator, {
  type ConfigureOptions,
} from './ConfigureGenerator.js';
import installWithYarn from '../installWithYarn.js';
import { resolvePath } from '../utils.js';

export { ConfigureGenerator, ConfigureOptions };

const FORMATTED_FILE = /\.(m?js|ts|tsx|json|html|scss|css)$/;

export default class AppGenerator<
  O extends ConfigureOptions = ConfigureOptions,
  F extends BaseFeatures = BaseFeatures,
> extends ConfigureGenerator<O, F> {
  constructor(args: string | string[], options: O, features: F) {
    super(args, options, { ...features, customInstallTask: installWithYarn });
    this.queueTransformStream(
      {},
      passthrough(async file => {
        if (!file.contents || !FORMATTED_FILE.test(file.path)) return;
        file.contents = Buffer.from(
          await format(file.contents.toString(), {
            // the generated project's own config (written by base)
            ...(
              this.fs.readJSON(this.destinationPath('package.json')) as
                { prettier?: Options } | undefined
            )?.prettier,
            filepath: file.path,
          }),
        );
      }),
    );
  }

  async prompting() {
    this.log(shelobsay(`Creating a new ${chalk.red('Anansi')} project!`));
    const props = await super.prompting();
    // await so the base generator's writes queue before the Prettier pass runs
    await this.composeWith(
      await resolvePath('../base', import.meta.url),
      this.args,
      {
        ...this.options,
        branded: true,
        projectType: props.projectType,
      } as any,
    );
    return props;
  }
}
