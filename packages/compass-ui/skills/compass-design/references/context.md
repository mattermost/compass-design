# Context: core feature, plugin, prototype

Decide which you are building before writing code. Ask the user if unclear.

| | Core feature (webapp) | Plugin | Prototype (proto-playground) |
| --- | --- | --- | --- |
| Depends on | `@mattermost/compass-ui` only | `@mattermost/compass-ui` only (own bundled copy) | `compass-ui` + `@mattermost/compass-proto` |
| Style import | Host already loads tokens | `import '@mattermost/compass-ui/styles'` once at entry | `styles` + `styles/standalone` |
| Standalone stylesheet | Never | **Never** (overrides user theme) | Yes |
| Patterns/shells (ChannelShell, Message, ChannelsSidebar, Mobile*, Call*) | Rebuild with compass-ui pieces | Not available | Import from `compass-proto` root barrel |
| Tooltips on icon buttons | Webapp's own tooltip | Webapp/own | `WithTooltip` from `compass-proto` |
| Strictness | Full: tokens, a11y, i18n, tests | Full; must coexist with host and other copies | Relaxed on data/state; **not** on tokens, hierarchy or a11y |
| i18n | Required (`ReactNode` text, label props) | Required | Plain strings OK |

## Plugin rules

- Bundle your own copy. Pick a version close to the one the webapp ships.
- Never wrap component CSS in `@layer` or use a bundler rule that layers third-party CSS.
- Use theme tokens so the plugin follows the user's theme. Don't assume a theme.
- RHS panels: 24px padding, header fixed, tab bar sticky once it reaches the top, footer pinned (see `spacing-and-hierarchy.md`).
- Fit the host: use the host's surfaces (RHS, modal, channel header actions, App Bar) before inventing new chrome. Plugin UI should not look like a separate product. **[proposed]**

## Core feature rules

- Use published components and tokens. Variant props use kebab-case literals.
- New or changed compass-ui components must follow the component API contract (`packages/compass-ui/AGENTS.md`): backward compatible, translatable text, label props, pass-through, refs.

## Prototype rules

- Prototype fast, but build it from real Compass pieces so it can be promoted. Fake data, not fake styling.
- No hardcoded hex or px to "fix later". Same token rules as production. **[proposed]**
- Mark anything that is a stand-in (mock data, missing component) with a short comment so it can be replaced.
- If a pattern you need exists in `compass-proto` but not `compass-ui`, note that it is non-core when presenting the prototype.
