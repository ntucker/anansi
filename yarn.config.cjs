// Examples are installed standalone (StackBlitz), so they track package versions
// with npm ranges instead of workspace:. See .cursor/rules/examples.mdc.
module.exports = {
  async constraints({ Yarn }) {
    for (const dep of Yarn.dependencies()) {
      if (!dep.workspace.cwd.startsWith('examples/')) continue;
      const target = Yarn.workspace({ ident: dep.ident });
      if (target) dep.update(`^${target.manifest.version}`);
    }
  },
};
