# Cyber Defense HQ fixtures

`generated.ts` is generated from the `trial-journey` dataset in
[`mattermost/mattermost-preview`](https://github.com/mattermost/mattermost-preview).
Do not edit it by hand. `lookups.ts` and `index.ts` are hand-written.

## Refresh

1. Update your checkout of `mattermost-preview` (the file header of `generated.ts` shows the commit it was last built from).
2. From the repo root:

   ```bash
   npm run generate:cyber-defense-fixtures -- --source ../mattermost-preview/datasets/trial-journey
   ```

   (`MATTERMOST_PREVIEW_DATASET` works in place of `--source`. Add `--download-icons` if the run reports missing integration icons.)

3. Check the result: `npm test` in `packages/compass-proto`, `npx tsc --noEmit` at the root, then look at the Channel layout and the Message Attachment specimen.
4. Commit `generated.ts` together with any new files under `src/assets/avatars/` and `src/assets/integrations/`.

The run is repeatable: the same source gives the same file, so a diff shows only real content changes.

## What it reads

| Source                             | Becomes                                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `people.yaml`                      | `cyberDefenseUsers` (people and bots; ids are usernames)                                              |
| `world.yaml` + `--team`            | `cyberDefenseTeam`                                                                                    |
| `script/<team>/*.md`               | `cyberDefenseChannels` and `cyberDefensePosts`                                                        |
| `script/dm/*.md`, `script/gm/*.md` | direct and group messages the login persona has open (`dataset.yaml` `persona.login`, and `shown_by`) |
| `assets/avatars/`                  | `src/assets/avatars/<username>.png`                                                                   |

State is from the persona's point of view: `favorite`, `unreadCount`, `mentionCount` and `firstUnreadPostId` come from the persona's `read` time in each transcript. System posts (join, leave, add, rename, privacy) are left out.

## It fails on what it doesn't know

A refresh never drops content silently. The run stops, and `generated.ts` stays as it was, when the data holds:

| Problem                             | What to do                                                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| A post `type` it doesn't map        | Add handling in the script, and a field on `FixturePost` if needed                                                                  |
| An emoji name with no glyph         | Add it to `EMOJI` (or `REPLACEMENTS` for a custom emoji) in the script                                                              |
| An integration icon it doesn't know | Add it to `INTEGRATION_ICONS` in the script, to `FixtureIntegrationIconId` in `types.ts`, and to `src/fixtures/integrationIcons.ts` |
| A user missing from `people.yaml`   | Fix the dataset                                                                                                                     |

## Notes

- Dates are fixed display strings built from relative source times and one anchor date (`ANCHOR` in the script). Leave it alone on a refresh.
- Post ids are the source's `id` attribute when it has one, otherwise `<channel>-<n>`, so unnamed posts can get new ids when messages are added above them. Nothing here relies on a particular id: tests and specimens pick posts by what they carry.
- Presence is not in the source: people who post are `online`, the rest rotate through away, do-not-disturb and offline.
- Bots without an avatar file use the default avatar.
