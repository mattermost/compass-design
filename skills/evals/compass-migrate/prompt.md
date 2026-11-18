# Shared prompt

Paste into the B session. Do not name the skill, and do not mention the review feedback.

Migrate the webapp of this Jira plugin from react-bootstrap, react-select and hand-rolled components to `@mattermost/compass-ui`.

- Scope: everything under `webapp/src` that renders UI: the create-issue, attach-comment, connect and disconnect modals, the subscriptions and templates screens, the selectors and form controls, tooltips and empty states.
- Use the latest published `@mattermost/compass-ui` (`0.1.0-alpha.30`) and the matching `@mattermost/compass-icons`.
- Update the unit and E2E tests to match.
- Work in this worktree only. Don't commit or push.
- When done, give a short final report.
