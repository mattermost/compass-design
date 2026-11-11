# mattermost-compass-toolkit

Agent skills for working with Compass. They install together and must stay side by side: `compass-review`, `compass-migrate` and `prototype-to-production` read the rules in `compass-build/references/`.

| Skill                     | Use it to                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `compass-build`           | Build or restyle Mattermost UI to the Compass rules. Owns the shared rules in `references/`. |
| `compass-review`          | Audit existing UI code against those rules without changing it.                              |
| `compass-migrate`         | Migrate a shipped plugin or webapp off react-bootstrap, react-select and custom UI.          |
| `prototype-to-production` | Translate a Compass playground prototype into the webapp, desktop app or a plugin.           |

```
prototype-to-production ──reads──▶ compass-build/references/
compass-migrate ────────reads──▶ compass-build/references/
        │
        └──invokes──▶ compass-review ──reads──▶ compass-build/references/
(prototype-to-production invokes compass-review too)
```

## Install

As a plugin, from the marketplace in this repo (the skills are namespaced, for example `mattermost-compass-toolkit:compass-review`):

```
/plugin marketplace add mattermost/compass-design
/plugin install mattermost-compass-toolkit@compass-design
```

On Claude Code 2.1.275 or later one step also works: `/plugin install mattermost-compass-toolkit --marketplace mattermost/compass-design`. Refresh later with `/plugin marketplace update compass-design`. The plugin updates when its `version` in `.claude-plugin/plugin.json` changes.

With the `skills` CLI, which copies the four skills side by side into the project (add `--global` for your user, or `--agent` for the agent you use):

```bash
npx skills add mattermost/compass-design --skill '*'
```

While developing the skills, load the plugin straight from a checkout:

```bash
claude --plugin-dir /path/to/compass-design/skills/compass-toolkit
```

By hand, copy or symlink all four skill folders into the agent's skills directory, keeping them side by side. Installing one skill without `compass-build` makes the others stop and ask you to install the toolkit.

Working on a consumer repo (the webapp, desktop app or a plugin)? Don't commit the installed skills into it.
