# Changelog

All notable changes to `@mattermost/compass-proto` are documented here.

`compass-proto` is unpublished (`private: true`) prototyping UI, so there are no releases or version sections: entries stay under `[Unreleased]`, each prefixed with the date it landed on `main` (`YYYY-MM-DD`, newest first). Changes to the published `@mattermost/compass-ui` package belong in [its changelog](../compass-ui/CHANGELOG.md), not here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- **2026-11-13 · `ChannelBookmarksBar` and `ChannelBookmarkModal`:** channel bookmarks bar for under the channel header. Bookmarks can carry an emoji; those that don't fit collapse into a `+N` overflow chip; each bookmark has an actions menu (edit, copy link, delete); an inline plus button opens an add menu (link or attachment) and `ChannelBookmarkModal` renders the matching form (link or file, plus an emoji picker). With no bookmarks the plus button becomes an "Add bookmark" chip. Controlled by the host through callbacks (`onAdd(type)`); strings are overridable via `labels`. Shown in the Channel layout specimen and the Channel Bookmarks Bar docs topic.

### Changed

- **2026-11-12 · `MobileMessageInput` `variant` values are now lowercase kebab-case (breaking for hosts that passed the old values):** `variant` takes `'root'` and `'reply'` instead of `'Root'` and `'Reply'`, matching the public variant-value convention. Update any `variant="Root"` / `variant="Reply"` usage to the lowercase values; the default is still `'root'`. Nothing else in the component's API changes.
