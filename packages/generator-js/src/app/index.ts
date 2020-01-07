import chalk from 'chalk';
import shelobsay from 'shelobsay';

import ConfigureGenerator from './ConfigureGenerator';

export { ConfigureGenerator };

export default class extends ConfigureGenerator {
  async prompting() {
    this.log(
      shelobsay(
        `Welcome to the panultimate ${chalk.red('anansi-js')} generator!`,
      ),
    );
    const props = await super.prompting();
    this.composeWith(require.resolve('../base'), {
      ...this.options,
      arguments: this.args,
      branded: true,
      projectType: props.projectType,
    });
    return props;
  }
}
