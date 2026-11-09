# Tokens and implementation

Source: `.claude/rules/styling.md`, `packages/compass-ui/AGENTS.md`, `/foundations/plugin-integration`.

## Imports

- Inside the `compass-ui` package itself (its stories and tests), import with the alias, default imports: `import Button from '@/components/Button/Button';`. Everywhere else (plugins, the webapp, the proto-playground, any consumer) use the published path below.
- Subpath imports only, named: `import { Button } from '@mattermost/compass-ui/components/button';` Never the root barrel. Component name PascalCase → kebab-case path. Sub-components are exported from the owning component's subpath (for example `CardButtonGroup` from `components/card-button`, `ModalOverlay` from `components/modal`): check the component folder's `index.ts` for what it exports.
- Load the token stylesheet once at the app or plugin entry: `import '@mattermost/compass-ui/styles';`
- Never load `@mattermost/compass-ui/styles/standalone` inside the Mattermost webapp or a plugin. It overrides the user's theme. Standalone apps and prototypes outside the webapp need it.
- Peer dependency `simplebar-react` is required (Modal, PopoverMenu, Select, Combobox, EmptyState render scrollbars).

## Tokens

| Concern     | Use                                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Spacing     | `--spacing-xxxxs` 2, `xxxs` 4, `xxs` 6, `xs` 8, `s` 10, `m` 12, `l` 16, `xl` 20, `xxl` 24, `xxxl` 32, `xxxxl` 40, `xxxxxl` 48 |
| Font size   | `--font-size-25`…`-1000` (10px…40px), body default `-100` (14px)                                                              |
| Font weight | `--font-weight-regular`, `--font-weight-semibold`. Never 700 unless Figma says so                                             |
| Line height | `--line-height-*`                                                                                                             |
| Radius      | `--radius-xs` 2, `s` 4, `m` 8, `l` 12, `xl` 16, `--radius-pill`                                                               |
| Shadow      | `--elevation-1`…`-6`                                                                                                          |
| Icon size   | `--icon-size-16`, `-20`, `-24` …                                                                                              |
| Motion      | `--duration-quick` 150ms, `--duration-moderate` 300ms, `--ease-transition`, `--ease-entrance`, `--ease-exit`                  |
| Stacking    | `--z-sidebar` 100, `--z-modal` 200, `--z-tooltip` 300                                                                         |

- Nearest token, or `calc()` of tokens, beats raw px. Allowed raw: 1px hairlines, visually-hidden, one-off layout widths with no token, breakpoints.
- No tokenizable spacing or font in inline `style={{}}`. Use a CSS module.
- Tokens are additive-only. Never rename, remove or revalue one. Add a new one.

```scss
// Bad
padding: 12px 16px;
gap: 8px;
border-radius: 8px;
color: #386fe5;
// Good
padding: var(--spacing-m) var(--spacing-l);
gap: var(--spacing-xs);
border-radius: var(--radius-m);
color: var(--link-color);
```

## SCSS

- One root BEM block per CSS module; nest `&__element` and `&--modifier`. Compound modifiers: `#{&}--a#{&}--b`.
- Do not use `:has()` together with `::placeholder` (enforced by test).
- Do not put component CSS in `@layer`.

## Component usage

- **Variant props** are lowercase kebab-case strings: `size="x-small"`, `emphasis="tertiary"`.
- **IconButton:** `icon={<Icon glyph={<SomeIcon />} />}`, normally no `size` (the button sizes it; an explicit `size` is allowed only as a deliberate override), always an `aria-label`.
- **Icons in slots** (`leadingIcon`, `icon`): pass `<Icon glyph={...} />` without `size`. The host component sizes it; an explicit `size` still takes precedence and is allowed as a deliberate override.
- **Links that look like buttons:** `Button asChild` wrapping `<a>` or a router `Link`. Never `<Link><Button/></Link>`.
- **Avatars:** real image from `src/assets/avatars/` when available; initials only as fallback.
- **Scrolling regions:** `Scrollbar`/`Scrollbars` component, not raw `overflow`.
- **Text props are `ReactNode`** and built-in English labels have override props (`closeLabel`, etc.). Never hardcode English in `aria-label`, `title` or `placeholder` inside a component.
- Variant props, composites and pass-through attributes: follow the component API contract in `packages/compass-ui/AGENTS.md` when you add or change a compass-ui component.

## Enforcement you can run

These scripts exist only in the compass-design repo itself. In the webapp, a plugin or the playground, use that project's own scripts (see "Checks to run" in the checklist).

- `npm run lint:styles` (stylelint: raw values, tokens, motion, shadow)
- `npm run lint` (eslint)
- `npm test` in `packages/compass-ui` (contract, English literals, markup, `:has()` tests)
