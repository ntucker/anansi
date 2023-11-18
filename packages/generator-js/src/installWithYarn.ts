import { execa } from 'execa';

// custom install task
export default async function installWithYarn(
  packageManagerName: string,
  execPackageManager: () => Promise<void>,
) {
  // use yarn if installed.
  // if someone installed yarn they probably mean to use it on any new projects.
  if (!packageManagerName) {
    try {
      await execa('which', ['yarn'], { shell: true });

      try {
        await execa(`corepack`, ['use yarn@*'], {
          shell: true,
          stdio: ['pipe', process.stdout, process.stderr],
        });
        // no need to do install after this works
        return;
        // eslint-disable-next-line no-empty
      } catch (e) {}

      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  // this is the default strategy
  return execPackageManager();
}
