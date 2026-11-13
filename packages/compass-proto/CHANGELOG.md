# Changelog

All notable changes to `@mattermost/compass-proto` are documented here.

`compass-proto` is unpublished (`private: true`) prototyping UI, so there are no releases or version sections: entries stay under `[Unreleased]`, each prefixed with the date it landed on `main` (`YYYY-MM-DD`, newest first). Changes to the published `@mattermost/compass-ui` package belong in [its changelog](../compass-ui/CHANGELOG.md), not here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Changed

- **2026-11-13 · `CallPopout` / `CallParticipantAvatar` use the new inverted IconButton hooks:** the popout container sets `--inverted-color`, `--inverted-color-rgb` and `--inverted-surface` from the `--calls-*` tokens so inverted IconButtons are readable on the call surface in every theme (Quartz included). Participant avatar hover uses `--inverted-color-rgb`.
- **2026-11-13 · `CallPopout` Leave button keeps its red fill on hover:** the destructive `IconButton` hover out-ranked the popout's single-class override, so Leave turned grey on hover. The override now doubles the class to win; hover is a darker red again.
- **2026-11-12 · `MobileMessageInput` `variant` values are now lowercase kebab-case (breaking for hosts that passed the old values):** `variant` takes `'root'` and `'reply'` instead of `'Root'` and `'Reply'`, matching the public variant-value convention. Update any `variant="Root"` / `variant="Reply"` usage to the lowercase values; the default is still `'root'`. Nothing else in the component's API changes.
