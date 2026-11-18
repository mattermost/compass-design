# Color and themes

Source: `/foundations/color`, `/foundations/themes`, `.claude/rules/styling.md`.

## Use roles, not palette

- Product UI uses **theme role tokens**: `--center-channel-bg`, `--center-channel-color`, `--button-bg`, `--button-color`, `--link-color`, `--error-text`, `--sidebar-*`. They adapt to every theme.
- Palette tokens (`--color-blue-500`) are for demos and data visualization only.
- Never hardcode hex. Never wrap a `var(--token)` in `rgba()`; use the `-rgb` variant: `rgba(var(--center-channel-color-rgb), 0.08)`.
- If `-rgb` may be absent (e.g. `--button-color-rgb`), use `color-mix()` instead.

## Surfaces and neutrals

- Page/panel background: `var(--center-channel-bg)`. Text: `var(--center-channel-color)`.
- Borders, dividers, subtle fills inside the center channel: `rgba(var(--center-channel-color-rgb), <alpha>)`. Typical divider alpha is 0.08.
- Inverted/sidebar surfaces: `--sidebar-header-bg` with `--sidebar-text`.

## Page background for admin pages

Admin console pages (only) sit on a tinted background: `rgba(var(--center-channel-color-rgb), 0.04)` behind everything. Content surfaces (admin panels, inputs) keep their own `--center-channel-bg` surface on top, and the header strip stays on `--center-channel-bg` (not always white: some themes tint it). If something is sticky or pinned over scrolling content on an admin page, use the opaque equivalent, `color-mix(in srgb, var(--center-channel-color) 4%, var(--center-channel-bg))`, so content doesn't show through. Right-sidebar forms and other views stay on `--center-channel-bg`.

## Semantic color

- Fixed intents: `--color-info|success|warning|danger` (+ `-rgb`). Never a raw palette shade.
- Errors and destructive UI: `var(--error-text, var(--color-danger))` so custom themes still work.
- Presence (online/away/DND) uses `--online-indicator`, `--away-indicator`, `--dnd-indicator`, not semantic colors.
- Never convey meaning by color alone. Pair with an icon or text.

## Opacity floors

| Element                               | Minimum alpha                         |
| ------------------------------------- | ------------------------------------- |
| Text                                  | 0.72 (placeholder 0.64, disabled 0.4) |
| Icons                                 | 0.56                                  |
| Disabled controls                     | 0.4                                   |
| Backgrounds, borders, fills, overlays | any                                   |

## Accent discipline **[proposed]**

- Brand color (`--button-bg`) marks the one primary action and key active state. Do not spread it across headings, icons, borders and badges.
- Most of a screen is neutral. Color should draw the eye to one or two things.

## Theme testing

Check every new surface on at least one light and one dark theme. Borders and translucent fills that look right on Denim often vanish on Indigo or Onyx.
