# Compass design toolkit skills

Agent skills for working with Compass. They live in the repo, not in `@mattermost/compass-ui`, so they are versioned and reviewed on their own and are not published to npm.

| Skill                                                         | Purpose                                                                                                                       |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`compass-build`](compass-build/SKILL.md)                     | Build, restyle or retrofit Mattermost UI to the Compass rules. Holds the shared `references/`.                                |
| [`compass-review`](compass-review/SKILL.md)                   | Read-only audit of existing UI code against the same rules. Reads `../compass-build/references/`.                             |
| [`prototype-to-production`](prototype-to-production/SKILL.md) | Translate a Compass playground prototype into the webapp, desktop app or a plugin. Moved from mattermost-proto-playground#76. |

`compass-review` and `prototype-to-production` read `compass-build`'s references, and `prototype-to-production` also invokes `compass-review`. Install all three together.

## Install

The quickest way is the `skills` CLI. Run it from your project, and it installs all three skills side by side:

```bash
npx skills add mattermost/compass-design --skill '*'
```

Add `--agent claude-code` to install only for Claude Code, or `--global` to install for your user instead of the project. The CLI downloads and runs an npm package, so check what it will install before you run it.

**Working on a consumer** (the webapp, desktop app or a plugin)? Run the command from that consumer's repo root, where you start your agent. The skills land in that project's `.claude/skills/`, which you probably don't want to commit there: add it to `.git/info/exclude` (a local-only ignore) and check `git status` after the install, since the CLI may write other files too. With `--global` nothing is added to the consumer.

Testing a skill with the [A/B harness](evals/prototype-to-production/README.md)? Don't install it globally: the without-skill side must not load it, and the setup script refuses to run if a copy is in `~/.claude/skills`.

To install by hand instead, copy or symlink each skill folder into the agent's skills directory, keeping the folders side by side:

```bash
# Claude Code, per project
mkdir -p .claude/skills
ln -s /path/to/compass-design/skills/compass-build .claude/skills/compass-build
ln -s /path/to/compass-design/skills/compass-review .claude/skills/compass-review
ln -s /path/to/compass-design/skills/prototype-to-production .claude/skills/prototype-to-production
```

If `compass-review` or `prototype-to-production` is installed without `compass-build`, it stops and tells you to install `compass-build` next to it.

## Testing a skill

[`evals/prototype-to-production/`](evals/prototype-to-production/README.md) holds a repeatable with-skill / without-skill A/B test: a setup script, a prompt template and a fixed rubric. It sits outside the skill folders so installing a skill doesn't copy it.

## Adding a skill

Add `skills/<skill-name>/SKILL.md` with `name` and `description` frontmatter. Put shared reference material in the skill that owns it and say so in the dependent skill.

When a component API change affects a rule or reference, update the skill in the same PR.
