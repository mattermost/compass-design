#!/usr/bin/env bash
# Create the with-skill / without-skill worktrees for an A/B test of
# prototype-to-production. See README.md in this folder.
set -euo pipefail

usage() {
  cat <<USAGE
Usage: setup-ab.sh --consumer <repo> --base <ref> --compass-design <repo> --name <slug>

  --consumer        Path to the consumer repo (mattermost, a plugin, ...)
  --base            Commit or ref both worktrees start from (e.g. origin/master)
  --compass-design  Path to a compass-design checkout that has skills/
  --name            Short slug used for branch and folder names
USAGE
}

consumer="" base="" cd_repo="" name=""
while [ $# -gt 0 ]; do
  case "$1" in
    --consumer) consumer="${2:-}"; shift 2 ;;
    --base) base="${2:-}"; shift 2 ;;
    --compass-design) cd_repo="${2:-}"; shift 2 ;;
    --name) name="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done
if [ -z "$consumer" ] || [ -z "$base" ] || [ -z "$cd_repo" ] || [ -z "$name" ]; then
  usage >&2; exit 2
fi
for s in compass-build compass-review prototype-to-production; do
  [ -d "$cd_repo/skills/$s" ] || { echo "Missing $cd_repo/skills/$s" >&2; exit 1; }
done

# The base must contain none of the three skills. The without-skill side would
# keep them while the with-skill side replaces them, so a difference in a
# companion skill's version could be blamed on the skill under test.
for s in compass-build compass-review prototype-to-production; do
  if git -C "$consumer" cat-file -e "$base:.claude/skills/$s" 2>/dev/null; then
    echo "Base $base already has .claude/skills/$s, so the without-skill run would not be a baseline. Pick another base." >&2
    exit 1
  fi
done

# A user-level copy of a skill would load in the without-skill session too.
# Don't move user files from here: ask for them to be moved, then restored.
for s in compass-build compass-review prototype-to-production; do
  if [ -e "$HOME/.claude/skills/$s" ] || [ -L "$HOME/.claude/skills/$s" ]; then
    echo "$HOME/.claude/skills/$s exists, so the without-skill session would load it. Move it out of ~/.claude/skills while you test, then restore it." >&2
    exit 1
  fi
done

root="$(cd "$consumer/.." && pwd)/ab-test-$name"
mkdir -p "$root"
sha="$(git -C "$consumer" rev-parse --short "$base")"

git -C "$consumer" worktree add -b "ab-$name-with-skill" "$root/with-skill" "$base"
git -C "$consumer" worktree add -b "ab-$name-without-skill" "$root/without-skill" "$base"

# Give the baseline its own, empty project skills directory. Without one, a
# newer Claude Code can fall back to the main checkout's skills in the baseline.
mkdir -p "$root/without-skill/.claude/skills"

# Copy (don't symlink) the skills, side by side, into the with-skill worktree only.
mkdir -p "$root/with-skill/.claude/skills"
for s in compass-build compass-review prototype-to-production; do
  # The base check above guarantees the destination doesn't exist.
  cp -R "$cd_repo/skills/$s" "$root/with-skill/.claude/skills/$s"
done

# Verify every skill copied completely (SKILL.md and references/ included).
echo "Verifying copied skills:"
for s in compass-build compass-review prototype-to-production; do
  src="$cd_repo/skills/$s"
  dst="$root/with-skill/.claude/skills/$s"
  [ -f "$dst/SKILL.md" ] || { echo "  $s: SKILL.md missing in copy" >&2; exit 1; }
  if [ -d "$src/references" ] && [ ! -d "$dst/references" ]; then
    echo "  $s: references/ missing in copy" >&2; exit 1
  fi
  diff -r "$src" "$dst" >/dev/null || { echo "  $s: copy differs from source" >&2; exit 1; }
  echo "  $s: $(find "$dst" -type f | wc -l | tr -d ' ') files, matches source"
done

cat <<DONE

Both worktrees start at $sha:
  with skill:    $root/with-skill
  without skill: $root/without-skill

Next:
  1. Install dependencies in EACH worktree (do not symlink node_modules).
  2. Fill in prompt.template.md and paste the identical prompt into a fresh
     Claude Code session in each worktree.
  3. Score both with rubric.md.

Clean up later with:
  git -C "$consumer" worktree remove --force "$root/with-skill"
  git -C "$consumer" worktree remove --force "$root/without-skill"
DONE
