---
paths:
  - "packages/compass-ui/package.json"
  - "packages/compass-proto/package.json"
---

# Version bumps

When any package version is bumped (`packages/compass-ui/package.json` or `packages/compass-proto/package.json`), **remind the user to update downstream consumers**:

- **mattermost-webapp** — update the `@mattermost/compass-ui` (and/or `@mattermost/compass-proto`) dependency and re-test affected components.
- **Plugins** — any plugin that imports from these packages needs the same dep bump.
- **proto-playground** — update its local dependency reference if it pins a version.

Also enforce the in-repo coupling: bumping `compass-ui` requires updating the matching `@mattermost/compass-ui` peer dependency in `packages/compass-proto/package.json` on the same branch before validation — the smoke-test script (`scripts/smoke-test-compass-proto-pack.mjs`) will fail with `ERESOLVE` otherwise.
