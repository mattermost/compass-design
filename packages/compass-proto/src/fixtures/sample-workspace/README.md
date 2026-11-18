# Sample workspace fixtures (the `workspace*` exports)

`generated.ts` is generated from the `trial-journey` dataset in
[`mattermost/mattermost-preview`](https://github.com/mattermost/mattermost-preview):
every team the dataset's login persona is on (Cyber Defense HQ, DevSecOps HQ and
MissionOps HQ at the moment), their channels and posts, and the direct and group
messages the persona has open. Do not edit it by hand. `lookups.ts` and `index.ts` are hand-written.

## Refresh

1. Update your checkout of `mattermost-preview` (the file header of `generated.ts` shows the commit it was last built from).
2. From the repo root:

   ```bash
   npm run generate:sample-workspace-fixtures -- --source ../mattermost-preview/datasets/trial-journey
   ```

   (`MATTERMOST_PREVIEW_DATASET` works in place of `--source`. Add `--download-icons` if the run reports missing integration icons or attachment images. `--teams a,b` narrows the teams; the default is every team the persona is on.)

3. Check the result: `npm test` in `packages/compass-proto`, `npx tsc --noEmit` at the root, then look at the Channel layout and the Message Attachment specimen.
4. Commit `generated.ts` together with any new files under `src/assets/avatars/`, `src/assets/integrations/`, `src/assets/attachment-images/` and `src/assets/team-icons/`.

The run is repeatable: the same source gives the same file, so a diff shows only real content changes.

## What it reads

| Source                                       | Becomes                                                                                                                                             |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `people.yaml`                                | `workspaceUsers` (people and bots; ids are usernames)                                                                                               |
| `world.yaml` + the persona's teams           | `workspaceTeams` (with the persona's unread and mention badge per team) and `workspaceTeam` (the first)                                             |
| `script/<team>/*.md`                         | `workspaceChannels` and `workspacePosts`                                                                                                            |
| `script/dm/*.md`, `script/gm/*.md`           | direct and group messages the login persona has open (`dataset.yaml` `persona.login`, and `shown_by`)                                               |
| attachment images (`image_url`, `thumb_url`) | `src/assets/attachment-images/<file name>.<type>` (downloaded with `--download-icons`; `src/fixtures/attachmentImages.ts` maps the id to the image) |
| `assets/team-icons/`                         | `src/assets/team-icons/<team id>.png` (`src/fixtures/teamIcons.ts` maps team id to image)                                                           |
| `assets/avatars/`                            | `src/assets/avatars/<username>.png`                                                                                                                 |

State is from the persona's point of view: `favorite`, `unreadCount`, `mentionCount` and `firstUnreadPostId` come from the persona's `read` time in each transcript. System posts (join, leave, add, rename, privacy) are left out.

## It fails on what it doesn't know

A refresh never drops content silently. The run stops, and `generated.ts` stays as it was, when the data holds:

| Problem                             | What to do                                                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A post `type` it doesn't map        | Add handling in the script, and a field on `FixturePost` if needed                                                                                                                                |
| An emoji name with no glyph         | Add it to `EMOJI` (or `REPLACEMENTS` for a custom emoji) in the script                                                                                                                            |
| An integration icon it doesn't know | Add it to `INTEGRATION_ICONS` in the script and to `FixtureIntegrationIconId` in `types.ts`, then run with `--download-icons` (the image is saved under its real type and picked up by file name) |
| A user missing from `people.yaml`   | Fix the dataset                                                                                                                                                                                   |

## Teams and ids

- Channel ids are `team/channel` (`dev-sec-ops-hq/alerts`), because every team has its own `town-square` and `off-topic`. Direct and group messages (`dm-…`, `gm-…`) have no `teamId` and show in every team.
- `buildChannelsSidebarModelFromFixtures({ teamId })` lists one team's channels plus the direct and group messages.
- A team's badge is the persona's unread channels and unread mentions (channels and threads) in that team.

## Notes

- Dates are fixed display strings built from relative source times and one anchor date (`ANCHOR` in the script). Leave it alone on a refresh.
- Post ids are the source's `id` attribute when it has one, otherwise `<channel>-<n>`, so unnamed posts can get new ids when messages are added above them. Nothing here relies on a particular id: tests and specimens pick posts by what they carry.
- Presence is not in the source: people who post are `online`, the rest rotate through away, do-not-disturb and offline.
- Bots without an avatar file use the default avatar.
