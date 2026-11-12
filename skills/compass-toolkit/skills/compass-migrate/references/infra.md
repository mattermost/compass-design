# Infra for a compass-ui migration

Step 2 of the process. Source for each item is marked: `gcal` is mattermost-plugin-google-calendar PR 179 (compass-ui alpha.22), **source** is the compass-ui changelog or code at alpha.28, **reported** is consumer feedback that I could not reproduce from the reference repos.

## Dependencies

- Add `@mattermost/compass-ui`, `@mattermost/compass-icons` and `simplebar-react`. gcal used compass-ui `0.1.0-alpha.22`, compass-icons `0.1.63`, simplebar-react `3.3.2`. Don't copy those versions: compass-ui's peer range for compass-icons is `^0.1.64` in the published alpha.29, so 0.1.63 is outside it. The latest compass-icons is 0.1.65 (alpha.30 raises the peer to `^0.1.65`); install that. `simplebar-react` must satisfy `^3.3.2`.
- `simplebar-react` is a **required** peer dependency (changelog, alpha.13). npm 7 and later install it automatically; yarn and pnpm setups may not, so add it explicitly. Modal, PopoverMenu, Select, Combobox and EmptyState render scrollbars with it.
- Remove what the migration replaces: `react-bootstrap`, `react-select`, and type packages only they used (gcal also dropped `@types/react-transition-group`). Remove the `react-bootstrap` entry from webpack `externals` and delete any `react-bootstrap.d.ts` shim. (gcal) Remove each only after a search shows nothing else imports it: a partial migration, or a component kept on the old stack (`not-covered.md`), still needs it.
- Plugins bundle their own copy of compass-ui. Pick a version close to the one the webapp ships (`../../compass-build/references/context.md`).

## Entry stylesheet

Import the token stylesheet once, first, at the plugin or app entry (gcal `index.tsx`):

```tsx
import '@mattermost/compass-ui/styles';
```

Never import `@mattermost/compass-ui/styles/standalone` in the webapp or a plugin; it overrides the user's theme.

## Webpack

compass-ui ships plain CSS and its JavaScript imports it, both `@mattermost/compass-ui/styles` and a `.css` file for each component. Component subpath imports such as `@mattermost/compass-ui/components/Modal` pull one in too, so the bundler needs a `.css` rule even if nothing imports `/styles`. Without one the build fails with "Module parse failed ... You may need an appropriate loader".

Give `.css` its own rule and keep sass for `.scss`. Don't put `exclude: /node_modules/` on the `.css` rule, because compass-ui's CSS lives there.

```js
{
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
},
{
    test: /\.scss$/,
    use: [ /* the existing style-loader, css-loader, sass-loader chain */ ],
},
```

Never wrap compass-ui CSS in `@layer` or add a bundler rule that layers third-party CSS (`../../compass-build/references/context.md`).

## ESLint

**Reported, not reproduced:** the import resolver may not understand compass-ui's subpath exports, so `import/no-unresolved` (or the equivalent rule) flags `@mattermost/compass-ui/components/...`. If it does, ignore those subpaths in that rule instead of changing the import to the root barrel.

## Delete in the same change

- Theme-prop plumbing: components that take or pass a `theme` object only to style themselves. Compass tokens follow the user's theme.
- react-select style overrides (`StylesConfig`, `styles={...}`) and the files that hold them.
- Wrapper components the new components make redundant (`Setting`, `FormButton`, `Loading`, a custom `Icon`). In gcal that was five files and a 128-line style helper.
- SCSS for the old markup. Keep only layout that has no Compass equivalent, written with tokens.
- Dead imports, dead test mocks for removed libraries.

## Stacking

Modals, confirm dialogs and portaled menus need an agreed order. From alpha.29 the `--z-` tokens give the right order with no overrides: modal 1050, menus 1100, popovers 1200, tooltips 1350; alpha.30 adds `--z-confirm-modal` (1060) for a confirm over a modal. On alpha.28 and earlier portaled menus default to 1000, below the webapp's modal layer (1050), so set `zIndex` explicitly. See `gotchas.md` (row 2) and the stacking note in `patterns.md`.
