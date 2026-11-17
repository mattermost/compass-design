import { useMemo, useState } from 'react';
import PlaylistCheckIcon from '@mattermost/compass-icons/components/playlist-check';
import { EmptyState } from '@mattermost/compass-ui/components/empty-state';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import { Tabs } from '@mattermost/compass-ui/components/tabs';
import { ThreadListItem } from '@mattermost/compass-ui/components/thread-list-item';
import {
  ChannelShell,
  MessageInput,
  RightSidebar,
  RightSidebarThread,
  workspaceChannels,
  workspaceCurrentUserId,
  getWorkspaceUser,
  shellStyles,
  type ChannelsSidebarModel,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import { integrationIcons } from '@/fixtures/integrationIcons';
import {
  plainPreview,
  threadMessages,
  threadsIn,
  type FixtureThreadView,
} from '@/guidelines/_components/fixtureThread';
import { useFixtureWorkspace } from '@/guidelines/_components/useFixtureWorkspace';
import inboxStyles from './threads-view.specimen.module.scss';

type ThreadsTab = 'all' | 'unreads';

/** The sidebar with the Threads row active and no channel selected. */
function withThreadsActive(model: ChannelsSidebarModel): ChannelsSidebarModel {
  return {
    topGroupItems: model.topGroupItems.map((row) =>
      row.leadingVisual === 'threads'
        ? { ...row, active: true }
        : { ...row, active: false },
    ),
    groups: model.groups.map((g) => ({
      ...g,
      items: g.items.map((row) => ({ ...row, active: false })),
    })),
  };
}

const authorOf = (thread: FixtureThreadView) =>
  thread.root.webhook?.displayName ??
  getWorkspaceUser(thread.root.userId)?.displayName ??
  thread.root.userId;

/**
 * The Threads inbox for the active team: the threads the signed-in user
 * follows (or, when it follows none, every thread), "Unreads" being the ones
 * with an unread mention, with the selected thread open on the right.
 */
export default function ThreadsViewLayout() {
  const { team, channels, shellProps } = useFixtureWorkspace();
  const [tab, setTab] = useState<ThreadsTab>('unreads');
  const [selectedId, setSelectedId] = useState<string>();

  const model = useMemo(
    () => withThreadsActive(shellProps.channelsSidebarModel),
    [shellProps.channelsSidebarModel],
  );

  // Threads in this team's channels and in the direct messages.
  const scope = useMemo(
    () =>
      new Set(
        workspaceChannels
          .filter(
            (c) =>
              c.memberIds?.includes(workspaceCurrentUserId) &&
              (!c.teamId || c.teamId === team?.id),
          )
          .map((c) => c.id),
      ),
    [team?.id],
  );
  const all = useMemo(() => threadsIn(scope), [scope]);
  const followed = all.filter((t) => t.following);
  const inbox = followed.length ? followed : all;
  const shown =
    tab === 'unreads' ? inbox.filter((t) => t.root.unreadMentions) : inbox;
  const selected = shown.find((t) => t.root.id === selectedId) ?? shown[0];
  const channelOf = (thread: FixtureThreadView) =>
    channels.find((c) => c.id === thread.root.channelId);

  return (
    <ChannelShell
      {...shellProps}
      channelsSidebarModel={model}
      innerContent={
        <div className={inboxStyles['threads-view__split']}>
          <div className={inboxStyles['threads-view__inbox']}>
            <header className={inboxStyles['threads-view__tabs']}>
              <Tabs
                className={inboxStyles['threads-view__tabs-strip']}
                tabs={[
                  { key: 'all', label: 'All your threads' },
                  { key: 'unreads', label: 'Unreads' },
                ]}
                activeKey={tab}
                onChange={(key: string) => {
                  if (key === 'all' || key === 'unreads') {
                    setTab(key);
                    setSelectedId(undefined);
                  }
                }}
                controls={
                  <IconButton
                    aria-label="Mark all as read"
                    size="small"
                    style="default"
                    padding="compact"
                    icon={<Icon size="16" glyph={<PlaylistCheckIcon />} />}
                  />
                }
              />
            </header>

            <div className={inboxStyles['threads-view__list']}>
              <Scrollbar>
                <div className={inboxStyles['threads-view__list-inner']}>
                  {shown.length === 0 && (
                    <EmptyState
                      title={
                        tab === 'unreads'
                          ? 'No unread threads'
                          : 'No threads yet'
                      }
                      description={
                        tab === 'unreads'
                          ? "You're all caught up."
                          : 'Threads you follow show up here.'
                      }
                    />
                  )}
                  {shown.map((thread) => {
                    const mentions = thread.root.unreadMentions;
                    const people = [
                      ...new Map(
                        thread.replies.map((r) => [r.userId, r]),
                      ).values(),
                    ].slice(0, 3);
                    return (
                      <ThreadListItem
                        key={thread.root.id}
                        active={thread.root.id === selected?.root.id}
                        badge={mentions ? 'mention' : 'none'}
                        mentionCount={mentions}
                        authorName={authorOf(thread)}
                        channelLabel={channelOf(thread)?.name.toUpperCase()}
                        previewText={plainPreview(thread.root.text)}
                        timestamp={thread.root.timestamp}
                        replyCount={thread.replies.length}
                        participants={people.map((r) => ({
                          key: r.userId,
                          name:
                            getWorkspaceUser(r.userId)?.displayName ?? r.userId,
                          src:
                            (r.webhook && integrationIcons[r.webhook.iconId]) ||
                            avatars[r.userId],
                        }))}
                        onClick={() => setSelectedId(thread.root.id)}
                      />
                    );
                  })}
                </div>
              </Scrollbar>
            </div>
          </div>

          {selected && (
            <RightSidebar
              fill
              alignBody="end"
              className={[
                shellStyles['channel-shell__right-sidebar'],
                shellStyles['channel-shell__right-sidebar--fill'],
              ].join(' ')}
              header={
                <RightSidebarHeader
                  title="Thread"
                  secondaryTitle={channelOf(selected)?.name}
                  actionLabel={selected.following ? 'Following' : undefined}
                  actionActive={selected.following}
                />
              }
              footer={
                <div className={shellStyles['channel-shell__message-input']}>
                  <MessageInput placeholder="Reply to thread…" width="narrow" />
                </div>
              }
            >
              <RightSidebarThread messages={threadMessages(selected)} />
            </RightSidebar>
          )}
        </div>
      }
    />
  );
}
