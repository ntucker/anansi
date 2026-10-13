import binVersionCheck from 'binary-version-check';
import fs from 'fs';
import latestVersion from 'latest-version';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { styleText } from 'node:util';

// TODO: Use this once stackblitz works with it
//import pkg from './package.json' assert { type: 'json' };
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, './package.json'), 'utf8'),
);

export const description = 'version';

export const verify = async () => {
  const version = await latestVersion(pkg.name);
  try {
    const result = await binVersionCheck('anansi', `>=${version}`);
    return result;
  } catch (error) {
    if (error.name === 'InvalidBinaryVersion') {
      // printed with console.error
      const stream = process.stderr;
      return `${styleText(
        'red',
        `Warning: ${pkg.name} is outdated. ${version} now available.`,
        { stream },
      )}\n${styleText('cyan', "Run 'npm update -g @anansi/cli' to update", { stream })}`;
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
