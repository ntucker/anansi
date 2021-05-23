const binVersionCheck = require('bin-version-check');
const latestVersion = require('latest-version');
const chalk = require('chalk');

const { name } = require('./package.json');

exports.description = 'version';

exports.verify = async () => {
  const version = await latestVersion(name);
  try {
    const result = await binVersionCheck('anansi', `>=${version}`);
    return result;
  } catch (error) {
    if (error.name === 'InvalidBinaryVersion') {
      return `${chalk.red(
        `Warning: ${name} is outdated. ${version} now available.`,
      )}\n${chalk.cyan("Run 'npm update -g @anansi/cli' to update")}`;
    }

    console.log(error);
    return;
  }
};

exports.verifyAndPrompt = async () => {
  const error = await exports.verify();
  if (error) {
    console.error(error);
  }
};
