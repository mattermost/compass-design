# Changelog

All notable changes to `@mattermost/compass-proto` are documented here.

`compass-proto` is unpublished (`private: true`) prototyping UI, so there are no releases or version sections: entries stay under `[Unreleased]`, each prefixed with the date it landed on `main` (`YYYY-MM-DD`, newest first). Changes to the published `@mattermost/compass-ui` package belong in [its changelog](../compass-ui/CHANGELOG.md), not here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- **2026-11-13 · `ProductRail` and `ProductRailItem`:** labeled vertical product rail (icon + label tiles with selected state, mention/unread badges, `header`/`footer` slots, translatable `navLabel`, `mentionsLabel`, `unreadLabel`). Not yet slotted into `ChannelShell` (tracked in #360). Part of #273. Also adds a `vitest` setup (`npm test`) to this package.

### Changed

- **2026-11-12 · `MobileMessageInput` `variant` values are now lowercase kebab-case (breaking for hosts that passed the old values):** `variant` takes `'root'` and `'reply'` instead of `'Root'` and `'Reply'`, matching the public variant-value convention. Update any `variant="Root"` / `variant="Reply"` usage to the lowercase values; the default is still `'root'`. Nothing else in the component's API changes.
