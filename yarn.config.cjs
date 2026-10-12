// Examples are opened standalone (e.g. StackBlitz runs npm in examples/concurrent),
// so they can't use `workspace:` ranges. lerna version skips them (private), so the
// root `version` script runs `yarn constraints --fix` to keep these ranges current.
/** @type {import('@yarnpkg/types')} */
module.exports = {
  async constraints({ Yarn }) {
    for (const dep of Yarn.dependencies()) {
      if (!dep.workspace.cwd.startsWith('examples/')) continue;
      const target = Yarn.workspace({ ident: dep.ident });
      if (target && !target.manifest.private)
        dep.update(`^${target.manifest.version}`);
    }
  },
};
