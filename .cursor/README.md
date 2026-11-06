# Cursor Cloud Agent environment

Files in this directory configure [Cursor Cloud Agents](https://cursor.com/docs/cloud-agent/setup) for this repo. Cursor reads `environment.json` from the branch an agent starts on.

| File                             | Purpose                                                                          |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `environment.json`               | Image, install/start hooks, forwarded ports (5173 docs app, 6006 Storybook)      |
| `Dockerfile`                     | Ubuntu 24.04 + Node 24.11.1 (matches `.nvmrc`) + `gh` + `xdg-utils`              |
| `scripts/cloud-agent-install.sh` | `npm ci` (skipped when the lockfile is unchanged) and builds `packages/*/dist`   |
| `scripts/cloud-agent-start.sh`   | Copies `cursor.md` to `.cursor/AGENTS.md`, raises inotify limits                 |
| `cursor.md`                      | Cloud-only agent instructions: running components, verification, troubleshooting |

`rules/` and `skills/` are regular Cursor project rules and skills, shared with local IDE use.

## Expected secrets

None. The repo needs no credentials to install, build, test, or run.

## Changing the environment

- Bump `NODE_VERSION` in the `Dockerfile` together with `.nvmrc` and `package.json` `engines`.
- Test locally from the repo root:

  ```bash
  docker build -t compass-cloud-agent -f .cursor/Dockerfile .cursor/
  docker run --rm -it -v "$PWD":/src:ro compass-cloud-agent bash -lc '
    rsync -a --exclude node_modules --exclude dist /src/ ~/compass-design/ &&
    cd ~/compass-design &&
    bash .cursor/scripts/cloud-agent-install.sh &&
    bash .cursor/scripts/cloud-agent-start.sh &&
    npm run check'
  ```

- Push the branch and start a Cloud Agent on it. "Environment ready with warnings" usually means a snapshot fell back to the default image — check the install log before trusting the run.
