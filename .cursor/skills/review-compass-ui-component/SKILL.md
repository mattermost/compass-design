---
name: review-compass-ui-component
description: Checklist for writing or reviewing a new or changed @mattermost/compass-ui component against the consumer API contract (backwards compatibility, translatable text, label props, attribute pass-through, refs, states, tests). Use before opening or approving a compass-ui component PR.
---

# Review a compass-ui component

Rules live in [packages/compass-ui/AGENTS.md → Component API contract](../../../packages/compass-ui/AGENTS.md#component-api-contract-consumers-mattermost-webapp-and-plugins). This is the step-by-step pass.

## 1. Public API diff

1. Diff the exported `Props` against the base branch. Any removed or renamed prop, narrowed type (e.g. `ReactNode` → `string`), changed default, or new required prop is a blocker — make it optional and additive. Exception: a behavior change that makes the component honor its existing types or docs (e.g. a prop it accepted but ignored) is a bug fix; keep the existing prop and add a CHANGELOG `### Fixed` entry.
2. Every new prop is optional, documented in JSDoc with its default, and its type is exported from the component's `index.ts` (and the root barrel when shared).
3. Variant values are lowercase kebab-case; icon slots use `IconSlotContext`.

## 2. Text and labels

1. Each prop that renders visible or accessible text is `ReactNode`. `string` only for data (filter labels, keys, ids), with a JSDoc reason.
2. Grep the component for English: `aria-label`, `title`, `placeholder`, `alt`, `label`, JSX text, and template strings that build names (`` `${n} replies` ``). Each one needs a prop with the English default (`*Label`, `*AriaLabel`, or `format*Label`).
3. Names derived from text (`aria-label={label}`) only derive from strings; a JSX label needs an explicit override prop.

## 3. Attributes, refs, states

1. Composite: `Props extends Omit<HTMLAttributes<Root>, …>`, root renders `{...rest}` before its own attributes, `className` merged.
2. Built-in close / dismiss / back / clear buttons take `*ButtonProps: BuiltInButtonProps`; collection items take `buttonProps`.
3. Interactive primitive: `forwardRef` to the focusable element; add it to `refs.test.tsx`.
4. Activatable things support `disabled`; async actions support `loading` via compass `Button`.
5. Menus closing on Escape call `preventDefault()`.

## 4. Host safety

1. Optional-chain browser APIs missing in jsdom / happy-dom.
2. No new optional peers for runtime imports; no CSS that depends on another package's copy.
3. Styles follow the styling rule pair (layers, additive-only tokens, `--radius-pill`, unlayered component CSS).
4. Overlay primitives stay chrome only.

## 5. Tests and docs

1. Add the component to `contract.test.tsx` (root attributes; every `*ButtonProps`).
2. `englishLiterals.test.ts` passes without growing `ALLOWLIST`.
3. Behavior tests for each new prop (rendered content, ARIA, callbacks), plus a `translatedContent.test.tsx` case for widened text props.
4. Default markup unchanged: `markup.test.tsx` snapshots untouched, or add one for the component.
5. Story and guideline specimen for each new visible state; CHANGELOG `[Unreleased]` entry.
6. Run from the repo root: `npm run lint`, `npm run format:check`, `npm run build:ui`, `npm run typecheck --workspace=@mattermost/compass-ui`, `npm test --workspace=@mattermost/compass-ui`, `npm run smoke-test:packages`, `npm run build-storybook`.
