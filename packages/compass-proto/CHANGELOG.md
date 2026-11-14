# Changelog

All notable changes to `@mattermost/compass-proto` are documented here.

`compass-proto` is unpublished (`private: true`) prototyping UI, so there are no releases or version sections: entries stay under `[Unreleased]`, each prefixed with the date it landed on `main` (`YYYY-MM-DD`, newest first). Changes to the published `@mattermost/compass-ui` package belong in [its changelog](../compass-ui/CHANGELOG.md), not here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- **2026-11-14 · fixtures:** exports `fixtureUsers`, `fixturePresence`, `fixtureTeams`, `fixtureChannels`, `fixturePosts` / `fixtureThreads` (with `getFixture*` lookups and `Fixture*` types) and `createAvatarRegistry`. The registry maps host-supplied image URLs (for example `import.meta.glob` over `src/assets/avatars/*.png`) onto fixture user ids, so a host no longer needs one import per avatar. The images are not bundled in the package. Fixture content is sample data derived from the docs app, not the playground branches.
- **2026-11-14 · `buildDefaultChannelsSidebarModel` `channelNames` and `avatars`:** `channelNames` renames rows (`name` and `avatarAlt`) by default name; `avatars` takes an avatar registry. The seven `avatar*` inputs are now optional and win over the registry when passed.
- **2026-11-13 · `QuickSwitchModal`:** keyboard-first "Find channels" switcher (Ctrl/Cmd+K dialog) matching the Patterns — Modals Figma: titled `Modal` (with a keyboard-help subtitle) with a `SearchInput` in the header, grouped `MenuItem` rows (`MenuGroupHeading` for Unread / Recent) with an inline `~handle`. Takes `items` and `onSelect` (plus `open`, `onClose`, optional `filter`, `onQueryChange`, `overlayProps`, and label props with English defaults); also exports `filterQuickSwitchItems` and the `QuickSwitchItem` type. Groups show only while the query is empty; typing flattens them into one list ranked by match closeness. A leading `~` in the query limits results to channels and `@` to direct messages (`QuickSwitchItem.kind`, inferred from an `@handle` when unset; `quickSwitchScope` / `quickSwitchKind` exported). Part of #263.

### Deprecated

- **2026-11-14 · `ChannelsSidebar` / `MobileChannelsSidebar` `channelNameOverrides`:** still works; prefer `channelNames` on the model builder.

### Changed

- **2026-11-12 · `MobileMessageInput` `variant` values are now lowercase kebab-case (breaking for hosts that passed the old values):** `variant` takes `'root'` and `'reply'` instead of `'Root'` and `'Reply'`, matching the public variant-value convention. Update any `variant="Root"` / `variant="Reply"` usage to the lowercase values; the default is still `'root'`. Nothing else in the component's API changes.
