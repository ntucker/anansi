#!/usr/bin/env bash
# Validate locally built anansi packages inside a consumer repo (default: a
# sibling data-client checkout) exactly as npm would deliver them.
#
# `yarn pack` applies publishConfig and rewrites workspace: ranges, so the
# consumer installs the same tarballs `npm publish` would upload. Portals or
# `yarn link` would instead expose src/ entrypoints (e.g. @anansi/core's
# `"module": "src/index.ts"`) and miss packaging bugs.
#
# Usage: scripts/consumer-link.sh <pack|link|unlink|status> [consumer-dir]
#   pack    build every public anansi package and pack it into $PACK_DIR
#   link    pack, then point the consumer's resolutions at those tarballs
#           and install (rerun after each anansi change)
#   unlink  restore the consumer's package.json and yarn.lock, then install
#   status  show whether the consumer is linked, and to which tarballs
set -euo pipefail

ANANSI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONSUMER_DIR="$(cd "${2:-${CONSUMER_DIR:-$ANANSI_DIR/../data-client}}" && pwd)"
PACK_DIR="${PACK_DIR:-$ANANSI_DIR/node_modules/.cache/consumer-link/packs}"
BACKUP_DIR="$CONSUMER_DIR/node_modules/.anansi-link"

# Build caches (babel-loader, Rspack/webpack, Jest) key on package versions,
# which packing leaves unchanged, so they'd keep serving the previous build
clear_caches() {
  rm -rf "$CONSUMER_DIR"/node_modules/.cache "$CONSUMER_DIR"/*/node_modules/.cache \
    "$CONSUMER_DIR"/*/*/node_modules/.cache
  (cd "$CONSUMER_DIR" && yarn jest --clearCache >/dev/null 2>&1) || true
}

pack() {
  rm -rf "$PACK_DIR" && mkdir -p "$PACK_DIR"
  cd "$ANANSI_DIR"
  yarn build:pkg
  # %s is the package name with the scope's @ and / made filesystem safe
  yarn workspaces foreach -Wt --no-private pack --out "$PACK_DIR/%s.tgz"
}

link() {
  pack
  cd "$CONSUMER_DIR"
  if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    cp package.json yarn.lock "$BACKUP_DIR/"
  fi
  # always start from the pristine manifest so removed packages unlink too
  cp "$BACKUP_DIR/package.json" package.json
  PACK_DIR="$PACK_DIR" node -e '
    const fs = require("fs"), path = require("path"), cp = require("child_process");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    pkg.resolutions ??= {};
    for (const file of fs.readdirSync(process.env.PACK_DIR)) {
      const tgz = path.join(process.env.PACK_DIR, file);
      const { name } = JSON.parse(
        cp.execFileSync("tar", ["-xOzf", tgz, "package/package.json"]),
      );
      pkg.resolutions[name] = `file:${tgz}`;
      console.log(`${name} -> ${tgz}`);
    }
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
  '
  # tarball contents change on every repack; refresh their lockfile checksums
  YARN_ENABLE_IMMUTABLE_INSTALLS=false YARN_CHECKSUM_BEHAVIOR=update yarn install
  clear_caches
  echo "Linked. Do not commit $CONSUMER_DIR/{package.json,yarn.lock}; run '$0 unlink' when done."
}

unlink() {
  cd "$CONSUMER_DIR"
  if [ ! -d "$BACKUP_DIR" ]; then
    echo "$CONSUMER_DIR is not linked."
    return
  fi
  cp "$BACKUP_DIR/package.json" "$BACKUP_DIR/yarn.lock" .
  rm -rf "$BACKUP_DIR"
  YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install
  clear_caches
}

status() {
  cd "$CONSUMER_DIR"
  if [ -d "$BACKUP_DIR" ]; then
    echo "$CONSUMER_DIR is linked to:"
    grep -o '"[^"]*": "file:[^"]*\.tgz"' package.json || true
  else
    echo "$CONSUMER_DIR is not linked."
  fi
}

case "${1:-}" in
  pack | link | unlink | status) "$1" ;;
  *)
    sed -n '2,/^set -euo/p' "$0" | sed '$d; s/^# \{0,1\}//'
    exit 1
    ;;
esac
