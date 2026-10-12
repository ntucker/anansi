#!/bin/bash
# Cloud sessions: install and build anansi so tests, lint and
# scripts/consumer-link.sh work immediately. Also installs a sibling
# data-client checkout (anansi's main consumer) when one is present.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

ANANSI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Jest's require(ESM) of Babel 8 needs Node 24.9+
node_ok() {
  node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>24||(a===24&&b>=9)?0:1)' 2>/dev/null
}
if ! node_ok; then
  export NVM_DIR="${NVM_DIR:-/opt/nvm}"
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm install 24 >/dev/null
  NODE_BIN="$(dirname "$(nvm which 24)")"
  export PATH="$NODE_BIN:$PATH"
  [ -n "${CLAUDE_ENV_FILE:-}" ] && echo "export PATH=\"$NODE_BIN:\$PATH\"" >> "$CLAUDE_ENV_FILE"
fi

# Both repos vendor yarn via yarnPath. Global yarn 1.x delegates to it;
# corepack would instead download yarn from repo.yarnpkg.com, which the
# sandbox egress may block. Fall back to the vendored release directly.
if ! (cd "$ANANSI_DIR" && yarn --version >/dev/null 2>&1); then
  YARN_BIN="$HOME/.local/share/anansi-yarn-shim"
  mkdir -p "$YARN_BIN"
  # run whichever release the current repo vendors
  printf '#!/bin/sh\nexec node "$(git rev-parse --show-toplevel)"/.yarn/releases/yarn-*.cjs "$@"\n' > "$YARN_BIN/yarn"
  chmod +x "$YARN_BIN/yarn"
  export PATH="$YARN_BIN:$PATH"
  [ -n "${CLAUDE_ENV_FILE:-}" ] && echo "export PATH=\"$YARN_BIN:\$PATH\"" >> "$CLAUDE_ENV_FILE"
fi

cd "$ANANSI_DIR"
# build:pkg does everything the workspaces' install scripts would (husky and
# yo pre-caching aside), so none need to run
yarn install --mode=skip-build
yarn build:pkg

if [ -f "$ANANSI_DIR/../data-client/package.json" ]; then
  cd "$ANANSI_DIR/../data-client"
  yarn install
fi
