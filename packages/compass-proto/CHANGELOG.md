# Changelog

All notable changes to `@mattermost/compass-proto` are documented here.

`compass-proto` is unpublished (`private: true`) prototyping UI, so there are no releases or version sections: entries stay under `[Unreleased]`, each prefixed with the date it landed on `main` (`YYYY-MM-DD`, newest first). Changes to the published `@mattermost/compass-ui` package belong in [its changelog](../compass-ui/CHANGELOG.md), not here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- **2026-11-13 · `DraftsPage`:** Drafts & scheduled page. Title, Drafts / Scheduled underlined `Tabs` with count badges, a list of `DraftListItem` rows (`drafts` and `scheduled` props, each item takes `DraftListItem` props plus `id`), and per-tab `EmptyState` with the drafts and scheduled illustrations. Tab labels and empty-state copy are overridable props.

### Changed

- **2026-11-12 · `MobileMessageInput` `variant` values are now lowercase kebab-case (breaking for hosts that passed the old values):** `variant` takes `'root'` and `'reply'` instead of `'Root'` and `'Reply'`, matching the public variant-value convention. Update any `variant="Root"` / `variant="Reply"` usage to the lowercase values; the default is still `'root'`. Nothing else in the component's API changes.
