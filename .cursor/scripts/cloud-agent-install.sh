#!/usr/bin/env bash
# Cursor Cloud Agent install ("update") hook. Runs from the project root on every boot
# and must stay idempotent; Cursor snapshots the result when it takes more than a few seconds.

set -Eeuo pipefail

log() { printf '[cloud-agent-install] %s\n' "$*" >&2; }

is_true() {
  case "${1:-}" in
    1|true|TRUE|yes|YES) return 0 ;;
    *) return 1 ;;
  esac
}

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

for tool in node npm git; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    log "Required tool '$tool' is not on PATH; .cursor/Dockerfile did not build as expected"
    exit 1
  fi
done

node_major="$(node -p 'process.versions.node.split(".")[0]')"
npm_major="$(npm --version | cut -d. -f1)"
if [ "$node_major" != "24" ] || [ "$npm_major" != "11" ]; then
  log "WARNING: expected Node 24 / npm 11 (package.json engines), found node $(node --version) / npm $(npm --version)"
fi

# npm ci wipes node_modules, so skip it when the lockfile and Node version are unchanged.
stamp_file="node_modules/.cloud-agent-install-stamp"
lock_stamp="$(sha256sum package-lock.json | cut -d' ' -f1) node-$(node --version)"

if is_true "${CLOUD_AGENT_SKIP_NPM_CI:-}"; then
  log "Skipping npm ci (CLOUD_AGENT_SKIP_NPM_CI set)"
elif [ -f "$stamp_file" ] && [ "$(cat "$stamp_file")" = "$lock_stamp" ] && ! is_true "${CLOUD_AGENT_FORCE_NPM_CI:-}"; then
  log "node_modules matches package-lock.json; skipping npm ci"
else
  log "Installing workspace dependencies (npm ci)"
  npm ci --no-audit --no-fund
  printf '%s\n' "$lock_stamp" > "$stamp_file"
fi

# The docs app, Storybook, and root typecheck consume packages/*/dist, not src.
# ensure-compass-ui.mjs rebuilds compass-ui and compass-proto only when dist is missing or stale.
if is_true "${CLOUD_AGENT_SKIP_PACKAGE_BUILD:-}"; then
  log "Skipping compass-ui / compass-proto build (CLOUD_AGENT_SKIP_PACKAGE_BUILD set)"
else
  log "Ensuring compass-ui and compass-proto dist/ are built"
  node scripts/ensure-compass-ui.mjs
fi

log "Tool versions:"
printf '  node %s\n  npm %s\n  %s\n' "$(node --version)" "$(npm --version)" "$(git --version)" >&2
command -v gh >/dev/null 2>&1 && gh --version | head -n1 | sed 's/^/  /' >&2

log "Install complete"
