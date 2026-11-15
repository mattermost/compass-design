# Changelog

All notable changes to `@mattermost/compass-proto` are documented here.

`compass-proto` is unpublished (`private: true`) prototyping UI, so there are no releases or version sections: entries stay under `[Unreleased]`, each prefixed with the date it landed on `main` (`YYYY-MM-DD`, newest first). Changes to the published `@mattermost/compass-ui` package belong in [its changelog](../compass-ui/CHANGELOG.md), not here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- **2026-11-14 · `Message` and `MessageInput` pass-through props:** `Message` (now exported as `MessageProps`) accepts HTML attributes (`data-*`, `aria-*`, `id`, handlers such as `onClick`) on its root, forwards a `ref` to the root, takes an `avatar` slot that replaces the default `UserAvatar`, and widens `username` to `ReactNode`. `MessageInput` accepts HTML attributes on its root, `onSend(value)` (Send button, and Enter without Shift when `onSend` is set; skipped for empty text, IME composition and Enter the host already prevented) and a `suggestions` slot above the input box. Default markup and behavior are unchanged when the new props are unset.
- **2026-11-13 · `QuickSwitchModal`:** keyboard-first "Find channels" switcher (Ctrl/Cmd+K dialog) matching the Patterns — Modals Figma: titled `Modal` (with a keyboard-help subtitle) with a `SearchInput` in the header, grouped `MenuItem` rows (`MenuGroupHeading` for Unread / Recent) with an inline `~handle`. Takes `items` and `onSelect` (plus `open`, `onClose`, optional `filter`, `onQueryChange`, `overlayProps`, and label props with English defaults); also exports `filterQuickSwitchItems` and the `QuickSwitchItem` type. Groups show only while the query is empty; typing flattens them into one list ranked by match closeness. A leading `~` in the query limits results to channels and `@` to direct messages (`QuickSwitchItem.kind`, inferred from an `@handle` when unset; `quickSwitchScope` / `quickSwitchKind` exported). Part of #263.

### Changed

- **2026-11-12 · `MobileMessageInput` `variant` values are now lowercase kebab-case (breaking for hosts that passed the old values):** `variant` takes `'root'` and `'reply'` instead of `'Root'` and `'Reply'`, matching the public variant-value convention. Update any `variant="Root"` / `variant="Reply"` usage to the lowercase values; the default is still `'root'`. Nothing else in the component's API changes.
