#!/bin/bash
# afterFileEdit hook: run eslint --fix on the edited file

set -euo pipefail

input=$(cat)
file_path=$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).file_path)" <<< "$input")

# Only lint JS/TS files
case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.mts|*.cjs|*.cts) ;;
  *) exit 0 ;;
esac

# Skip build output and template directories (matched by eslint ignores anyway,
# but avoids a wasted spawn)
case "$file_path" in
  */lib/*|*/lib-*/*|*/dist/*|*/dist-*/*|*/generators/*|*/templates/*) exit 0 ;;
esac

cd "$CURSOR_PROJECT_DIR"
npx eslint --fix "$file_path" >/dev/null 2>&1 || true

exit 0
