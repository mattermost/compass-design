#!/usr/bin/env bash
# Cursor Cloud Agent start hook. Keep it fast: dev servers are started on demand
# (see .cursor/cursor.md), not here.

set -Eeuo pipefail

log() { printf '[cloud-agent-start] %s\n' "$*" >&2; }

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Cloud-only instructions; .cursor/AGENTS.md is gitignored so local IDE runs never see it.
if [ -f .cursor/cursor.md ]; then
  cp .cursor/cursor.md .cursor/AGENTS.md
  log "Materialized Cloud Agent instructions at .cursor/AGENTS.md"
fi

# Raising inotify limits needs a writable /proc/sys; some sandboxes refuse, which is non-fatal.
if [ -f /etc/sysctl.d/60-compass-inotify.conf ]; then
  sudo sysctl -q -p /etc/sysctl.d/60-compass-inotify.conf >/dev/null 2>&1 ||
    log "Could not raise inotify limits; watchers may hit ENOSPC (see .cursor/cursor.md)"
fi

log "inotify max_user_watches=$(cat /proc/sys/fs/inotify/max_user_watches 2>/dev/null || echo unknown)"
log "Start complete"
