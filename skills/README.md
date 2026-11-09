# Compass design toolkit skills

Agent skills for working with Compass. They live in the repo, not in `@mattermost/compass-ui`, so they are versioned and reviewed on their own and are not published to npm.

| Skill                                                         | Purpose                                                                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [`compass-build`](compass-build/SKILL.md)                     | Build, restyle or retrofit Mattermost UI to the Compass rules. Holds the shared `references/`.                                       |
| [`compass-review`](compass-review/SKILL.md)                   | Read-only audit of existing UI code against the same rules. Reads `../compass-build/references/`.                                    |
| [`prototype-to-production`](prototype-to-production/SKILL.md) | Translate a Compass playground prototype into the webapp, desktop app or a plugin. Draft, moved from mattermost-proto-playground#76. |

`compass-review` depends on `compass-build`'s references, so install them together.

## Install

Copy or symlink each skill folder into the agent's skills directory, keeping the folders side by side:

```bash
# Claude Code, per project
mkdir -p .claude/skills
ln -s /path/to/compass-design/skills/compass-build .claude/skills/compass-build
ln -s /path/to/compass-design/skills/compass-review .claude/skills/compass-review
```

## Testing a skill

[`evals/prototype-to-production/`](evals/prototype-to-production/README.md) holds a repeatable with-skill / without-skill A/B test: a setup script, a prompt template and a fixed rubric. It sits outside the skill folders so installing a skill doesn't copy it.

## Adding a skill

Add `skills/<skill-name>/SKILL.md` with `name` and `description` frontmatter. Put shared reference material in the skill that owns it and say so in the dependent skill.

When a component API change affects a rule or reference, update the skill in the same PR.
