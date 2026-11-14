# Compass skills

All agent skills for this repo live here. They are not part of `@mattermost/compass-ui`, so they are versioned and reviewed on their own and are not published to npm.

```
.claude-plugin/marketplace.json  # the marketplace: lists the plugin below
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

| Skill                                                                                | Purpose                                                                                                                                                                |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`compass-build`](compass-toolkit/skills/compass-build/SKILL.md)                     | Build, restyle or retrofit Mattermost UI to the Compass rules. **Owns the shared rules** in `references/`.                                                             |
| [`compass-review`](compass-toolkit/skills/compass-review/SKILL.md)                   | Read-only audit of existing UI code against the same rules. Reads `../compass-build/references/`.                                                                      |
| [`compass-migrate`](compass-toolkit/skills/compass-migrate/SKILL.md)                 | Migrate a shipped plugin or webapp from react-bootstrap, react-select and custom UI to Compass: inventory first, patterns, gotchas by version, tests, required checks. |
| [`prototype-to-production`](compass-toolkit/skills/prototype-to-production/SKILL.md) | Translate a Compass playground prototype into the webapp, desktop app or a plugin.                                                                                     |

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

Playbooks for working on this repo, outside the plugin. `.cursor/skills/` and `.claude/skills/` hold symlinks to them, so Cursor and Claude Code both load them when working in this repo.

| Skill                                                                          | Purpose                                                         |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| [`add-docs-topic`](internal/add-docs-topic/SKILL.md)                           | Add a Compass docs topic (MDX, optional specimen, `topics.ts`). |
| [`review-compass-ui-component`](internal/review-compass-ui-component/SKILL.md) | Checklist for a new or changed compass-ui component.            |

## Install the toolkit

As a plugin, from the marketplace in this repo. The skills are namespaced, for example `mattermost-compass-toolkit:compass-review`:

```
/plugin marketplace add mattermost/compass-design
/plugin install mattermost-compass-toolkit@compass-design
```

`.claude-plugin/marketplace.json` at the repo root is the marketplace; it points at `skills/compass-toolkit/`. Listing it in the org plugin library is still open (see `docs/ROADMAP.md`).

Or with the `skills` CLI. Run it from your project and it copies the four toolkit skills side by side (add `--global` for your user, or `--agent` for the agent you use):

```bash
npx skills add mattermost/compass-design --skill '*'
```

The two repo-only playbooks in `internal/` are marked `metadata.internal: true`, so the CLI does not list or install them. Tested with `skills` 1.8.1 against this layout: it finds the skills in `compass-toolkit/skills/`, and the installed folders resolve each other's `../compass-build/references/`. The CLI downloads and runs an npm package, so check what it will install before you run it.

To load the plugin from a checkout of this repo while you work on the skills:

```bash
claude --plugin-dir /path/to/compass-design/skills/compass-toolkit
```

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
- **Repo-internal:** add `skills/internal/<skill-name>/SKILL.md`, set `metadata.internal: true` in its frontmatter so `npx skills add` does not install it into consumers, then symlink it from both `.cursor/skills/<skill-name>` and `.claude/skills/<skill-name>`.

When a component API change affects a rule or reference, update the skill in the same PR.

## Releasing the plugin

The plugin pins `version` in `skills/compass-toolkit/.claude-plugin/plugin.json`, so installed copies only update when it changes. CI (`.github/workflows/plugin-version.yml`) fails a PR that changes files under `skills/compass-toolkit/skills/` without changing that `version`. Bump it in the PR, or add the `skip-plugin-version` label when installed copies need no update. Keep `version` in `skills/compass-toolkit/.cursor-plugin/plugin.json` equal to it; CI does not check that file. Then run `claude plugin validate .` (checks the marketplace) and `claude plugin validate skills/compass-toolkit` (checks the plugin).
