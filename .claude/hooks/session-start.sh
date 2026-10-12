#!/bin/bash
# Cloud sessions: install and build anansi so tests, lint and
# scripts/consumer-link.sh work immediately. Also installs a sibling
# data-client checkout (anansi's main consumer) when one is present.
#
# Yarn comes from each repo's .yarn/releases via yarnPath (global yarn 1.x
# delegates to it). Don't enable corepack: it downloads yarn from
# repo.yarnpkg.com, which sandbox egress may block.
set -euo pipefail

if [[ "${CLAUDE_CODE_REMOTE:-}" != "true" ]]; then
  exit 0
fi

ANANSI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ANANSI_DIR"

# Jest's require(ESM) of Babel 8 needs Node 24.9+ (.nvmrc)
if (( "$(node -p 'process.versions.node.split(".")[0]')" < "$(cat .nvmrc)" )); then
  export NVM_DIR="${NVM_DIR:-/opt/nvm}"
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  # also puts that node first on this shell's PATH
  nvm install >/dev/null
  NODE_BIN="$(dirname "$(command -v node)")"
  if [[ -n "${CLAUDE_ENV_FILE:-}" ]]; then
    echo "export PATH=\"$NODE_BIN:\$PATH\"" >> "$CLAUDE_ENV_FILE"
  fi
fi

# Its install scripts only prebuild packages; validation builds explicitly.
# Independent of anansi's build, so it runs alongside it
CONSUMER="$ANANSI_DIR/../data-client"
consumer_install=
if [[ -f "$CONSUMER/package.json" ]]; then
  (cd "$CONSUMER" && yarn install --mode=skip-build) &
  consumer_install=$!
fi

# build:pkg does everything the workspaces' install scripts would (husky and
# yo pre-caching aside), so none need to run
yarn install --mode=skip-build
yarn build:pkg
if [[ -n "$consumer_install" ]]; then
  wait "$consumer_install"
fi
