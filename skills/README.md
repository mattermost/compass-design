# Compass skills

All agent skills for this repo live here. They are not part of `@mattermost/compass-ui`, so they are versioned and reviewed on their own and are not published to npm.

```
skills/
  compass-toolkit/              # the plugin: mattermost-compass-toolkit (ships as one unit)
    .claude-plugin/plugin.json
    skills/
      compass-build/            # owns the shared rules in references/
      compass-review/
      compass-migrate/
      prototype-to-production/
  internal/                     # repo playbooks, not shipped
    add-docs-topic/
    review-compass-ui-component/
  evals/                        # test harnesses, outside both groups so installs don't copy them
```

## Toolkit skills (shipped)

| Skill                                                                                  | Purpose                                                                                                                       |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`compass-build`](compass-toolkit/skills/compass-build/SKILL.md)                       | Build, restyle or retrofit Mattermost UI to the Compass rules. **Owns the shared rules** in `references/`.                    |
| [`compass-review`](compass-toolkit/skills/compass-review/SKILL.md)                     | Read-only audit of existing UI code against the same rules. Reads `../compass-build/references/`.                             |
| [`compass-migrate`](compass-toolkit/skills/compass-migrate/SKILL.md)                   | Migrate a shipped plugin or webapp from react-bootstrap, react-select and custom UI to Compass: inventory first, patterns, gotchas by version, tests, required checks. |
| [`prototype-to-production`](compass-toolkit/skills/prototype-to-production/SKILL.md)   | Translate a Compass playground prototype into the webapp, desktop app or a plugin. Moved from mattermost-proto-playground#76. |

How they depend on each other:

```
prototype-to-production ──reads──▶ compass-build/references/   (rules)
compass-migrate ────────reads──▶ compass-build/references/
        │
        └──invokes──▶ compass-review ──reads──▶ compass-build/references/
(prototype-to-production invokes compass-review too)
```

There is one copy of the rules, in `compass-build/references/`. The other two skills read it through `../compass-build/references/`, and `prototype-to-production` also keeps its own `references/` for material only it uses. The three skills must stay side by side, which is why they ship as one plugin.

## Internal skills (not shipped)

Playbooks for working on this repo, outside the plugin. `.cursor/skills/` holds symlinks to them so Cursor still finds them.

| Skill                                                                | Purpose                                                              |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [`add-docs-topic`](internal/add-docs-topic/SKILL.md)                 | Add a Compass docs topic (MDX, optional specimen, `topics.ts`).      |
| [`review-compass-ui-component`](internal/review-compass-ui-component/SKILL.md) | Checklist for a new or changed compass-ui component.       |

## Install the toolkit

As a plugin, the skills are namespaced, for example `mattermost-compass-toolkit:compass-review`.

To try it from a checkout of this repo:

```bash
claude --plugin-dir /path/to/compass-design/skills/compass-toolkit
```

Marketplace distribution (org plugin library or a git marketplace) is not set up yet; see `docs/ROADMAP.md`.

**Working on a consumer** (the webapp, desktop app or a plugin)? Don't commit the installed skills into that repo.

To install by hand without the plugin, copy or symlink all the skill folders into the agent's skills directory, keeping them side by side:

```bash
# Claude Code, per project
mkdir -p .claude/skills
for s in compass-build compass-review compass-migrate prototype-to-production; do
  ln -s /path/to/compass-design/skills/compass-toolkit/skills/$s .claude/skills/$s
done
```

If `compass-review`, `compass-migrate` or `prototype-to-production` is missing a sibling, it stops and tells you to install the toolkit.

## Testing a skill

[`evals/prototype-to-production/`](evals/prototype-to-production/README.md) holds a repeatable with-skill / without-skill A/B test: a setup script, a prompt template and a fixed rubric. It installs the skills as standalone `.claude/skills/` folders, so it doesn't exercise the plugin path. Don't install the skills globally while you test: the setup script refuses to run if a copy is in `~/.claude/skills`.

## Adding a skill

- **Shipped:** add `skills/compass-toolkit/skills/<skill-name>/SKILL.md` with `name` and `description` frontmatter. Put shared reference material in the skill that owns it and say so in the dependent skill.
- **Repo-internal:** add `skills/internal/<skill-name>/SKILL.md`, then symlink it from `.cursor/skills/<skill-name>`.

When a component API change affects a rule or reference, update the skill in the same PR.
