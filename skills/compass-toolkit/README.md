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

With the `skills` CLI, which copies the four skills side by side into the project (add `--global` for your user, or `--agent` for the agent you use):

```bash
npx skills add mattermost/compass-design --skill '*'
```

As a plugin (skills are namespaced, for example `mattermost-compass-toolkit:compass-review`), from a checkout of the repo:

```bash
claude --plugin-dir /path/to/compass-design/skills/compass-toolkit
```

A marketplace entry for the plugin is not set up yet.

By hand, copy or symlink all four skill folders into the agent's skills directory, keeping them side by side. Installing one skill without `compass-build` makes the others stop and ask you to install the toolkit.

Working on a consumer repo (the webapp, desktop app or a plugin)? Don't commit the installed skills into it.
