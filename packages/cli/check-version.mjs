import binVersionCheck from 'bin-version-check';
import latestVersion from 'latest-version';
import chalk from 'chalk';

import pkg from './package.json' assert { type: 'json' };

export const description = 'version';

export const verify = async () => {
  const version = await latestVersion(pkg.name);
  try {
    const result = await binVersionCheck('anansi', `>=${version}`);
    return result;
  } catch (error) {
    if (error.name === 'InvalidBinaryVersion') {
      return `${chalk.red(
        `Warning: ${pkg.name} is outdated. ${version} now available.`,
      )}\n${chalk.cyan("Run 'npm update -g @anansi/cli' to update")}`;
    }

    console.log(error);
    return;
  }
};

export const verifyAndPrompt = async () => {
  const error = await verify();
  if (error) {
    console.error(error);
  }
};
