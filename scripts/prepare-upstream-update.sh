#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -n "$(git status --porcelain)" ]; then
  echo "Commit or stash modifications first." >&2
  exit 1
fi
if [ "$(git branch --show-current)" != "3.0" ]; then
  echo "Run this from branch 3.0." >&2
  exit 1
fi
if ! git remote get-url upstream >/dev/null 2>&1; then
  git remote add upstream https://github.com/dwainscheeren/dwains-lovelace-dashboard.git
fi
git fetch upstream 3.0
if git merge-base --is-ancestor upstream/3.0 HEAD; then
  echo "Already contains upstream/3.0."
  exit 0
fi
review="upstream-sync-$(date +%Y%m%d)-$(git rev-parse --short upstream/3.0)"
git switch -c "$review"
if ! git merge --no-ff --no-edit upstream/3.0; then
  echo "Merge conflict: preserve bundled Korean language and custom badges; see FORK_CHANGES.md" >&2
  exit 2
fi
node scripts/fork-check.cjs stamp
node scripts/fork-check.cjs verify
echo "Ready for manual PR review and Home Assistant testing. Main 3.0 untouched."
