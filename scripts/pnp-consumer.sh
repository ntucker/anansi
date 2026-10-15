#!/usr/bin/env bash
# Check the packed anansi packages work for a Yarn PnP consumer. This repo
# can't run on PnP itself until TypeScript 7's tsc supports it, so this
# installs them into scripts/pnp-consumer/ (copied to a temp dir) instead.
#
# PnP only lets a package require what it declares, so this catches missing
# dependencies that node_modules hoisting hides.
#
# Usage: scripts/pnp-consumer.sh
#   SKIP_BUILD=1  packages are already built (prepack still rebuilds some)
set -euo pipefail

ANANSI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PACK_DIR="${PACK_DIR:-$ANANSI_DIR/node_modules/.cache/pnp-consumer/packs}"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

"$ANANSI_DIR/scripts/consumer-link.sh" pack

cp -R "$ANANSI_DIR/scripts/pnp-consumer/." "$WORK_DIR"
cd "$WORK_DIR"
echo "yarnPath: $(ls "$ANANSI_DIR"/.yarn/releases/yarn-*.cjs)" >> .yarnrc.yml
# every packed package, so each one's own dependencies get checked
node -e '
  const fs = require("fs"), path = require("path"), cp = require("child_process");
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.resolutions = {};
  for (const file of fs.readdirSync(process.env.PACK_DIR)) {
    const tgz = path.join(process.env.PACK_DIR, file);
    const { name } = JSON.parse(
      cp.execFileSync("tar", ["-xOzf", tgz, "package/package.json"]),
    );
    pkg.resolutions[name] = `file:${tgz}`;
    pkg.devDependencies[name] ??= "*";
  }
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
'
YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install --mode=skip-build

echo "--- load every package"
yarn node -e '
  const { devDependencies } = require("./package.json");
  const pnp = require("pnpapi");
  for (const name of Object.keys(devDependencies)) {
    if (!/^@(anansi|pojo-router)\//.test(name)) continue;
    const dir = pnp.resolveToUnqualified(name, `${process.cwd()}/`);
    const pkg = require(`${dir}/package.json`);
    // bin-only packages have nothing to load
    if (!pkg.main && !pkg.exports) continue;
    try {
      require(name);
    } catch (error) {
      console.error(name, error.message);
      process.exitCode = 1;
    }
  }
'

echo "--- jest"
yarn jest --ci

echo "--- eslint"
# resolver failures are only logged, so fail on them too
yarn eslint --max-warnings=0 src 2>&1 | tee eslint.log
if grep -q 'Resolve error' eslint.log; then exit 1; fi

echo "--- webpack"
yarn webpack --mode=production
yarn webpack --mode=production --target=node --env entrypath=index.server.tsx
# dependencies stay external rather than bundled
grep -q 'require("react-dom/server")' dist-server/*.js

echo "PnP consumer checks passed"
