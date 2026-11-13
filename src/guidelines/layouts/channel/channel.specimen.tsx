import { useState } from 'react';
import { defaultChannelsSidebarDemoModel } from '@/fixtures/channelsSidebarDemo';
import { ReactionsRow } from '@mattermost/compass-ui/components/reactions-row';
import { MessageSeparator } from '@mattermost/compass-ui/components/message-separator';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarAikoTan from '@/assets/avatars/Aiko Tan.png';
import avatarArjunPatel from '@/assets/avatars/Arjun Patel.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import { ChannelHeader } from '@mattermost/compass-proto';
import {
  ChannelBookmarkModal,
  ChannelBookmarksBar,
  type ChannelBookmark,
} from '@mattermost/compass-proto';
import { ChannelShell } from '@mattermost/compass-proto';
import { MessageInput } from '@mattermost/compass-proto';
import { Message } from '@mattermost/compass-proto';
import { RightSidebarChannelInfo } from '@mattermost/compass-proto';
import { shellStyles } from '@mattermost/compass-proto';

const DEFAULT_BOOKMARKS: ChannelBookmark[] = [
  {
    id: 'wiki',
    label: 'Team wiki',
    labelText: 'Team wiki',
    href: 'https://example.com/wiki',
  },
  {
    id: 'roadmap',
    label: 'Q4 roadmap',
    labelText: 'Q4 roadmap',
    href: 'https://example.com/roadmap',
  },
  {
    id: 'design',
    label: 'Design system',
    labelText: 'Design system',
    href: 'https://example.com/design',
  },
  {
    id: 'handbook',
    label: 'Employee handbook',
    labelText: 'Employee handbook',
    type: 'file',
    href: 'https://example.com/handbook.pdf',
  },
  {
    id: 'standup',
    label: 'Weekly standup notes',
    labelText: 'Weekly standup notes',
    href: 'https://example.com/standup',
  },
  {
    id: 'oncall',
    label: 'On-call rotation',
    labelText: 'On-call rotation',
    href: 'https://example.com/oncall',
  },
  {
    id: 'status',
    label: 'Status page',
    labelText: 'Status page',
    href: 'https://example.com/status',
  },
];

export default function ChannelLayout() {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [bookmarks, setBookmarks] =
    useState<ChannelBookmark[]>(DEFAULT_BOOKMARKS);
  const [modal, setModal] = useState<{
    open: boolean;
    editing?: ChannelBookmark;
  }>({ open: false });

  return (
    <ChannelShell
      channelsSidebarModel={defaultChannelsSidebarDemoModel}
      channelHeader={
        <>
          <ChannelHeader
            type="channel"
            name="Town Square"
            description="Company-wide announcements and general discussion."
            memberCount={124}
            pinnedCount={2}
            onInfoClick={() => setRightSidebarOpen((o) => !o)}
            infoToggled={rightSidebarOpen}
          />
          <ChannelBookmarksBar
            bookmarks={bookmarks}
            onAdd={() => setModal({ open: true })}
            onEdit={(b) => setModal({ open: true, editing: b })}
            onDelete={(b) =>
              setBookmarks((all) => all.filter((x) => x.id !== b.id))
            }
            onCopyLink={(b) =>
              void navigator.clipboard?.writeText(b.href ?? '')
            }
          />
          <ChannelBookmarkModal
            open={modal.open}
            initialValues={
              modal.editing
                ? {
                    title: modal.editing.labelText,
                    url: modal.editing.href,
                  }
                : undefined
            }
            onClose={() => setModal((m) => ({ ...m, open: false }))}
            onSubmit={({ title, url }) => {
              const editing = modal.editing;
              setBookmarks((all) =>
                editing
                  ? all.map((b) =>
                      b.id === editing.id
                        ? { ...b, label: title, labelText: title, href: url }
                        : b,
                    )
                  : [
                      ...all,
                      {
                        id: `bm-${Date.now()}`,
                        label: title,
                        labelText: title,
                        href: url,
                      },
                    ],
              );
              setModal({ open: false });
            }}
          />
        </>
      }
      trailing={
        rightSidebarOpen ? (
          <aside className={shellStyles['channel-shell__right-sidebar']}>
            <RightSidebarHeader
              title="Channel Info"
              secondaryTitle="Town Square"
              onClose={() => setRightSidebarOpen(false)}
            />
            <div className={shellStyles['channel-shell__right-sidebar-body']}>
              <Scrollbar>
                <RightSidebarChannelInfo />
              </Scrollbar>
            </div>
          </aside>
        ) : undefined
      }
    >
      <>
        <div className={shellStyles['channel-shell__messages']}>
          <Scrollbar>
            <div className={shellStyles['channel-shell__messages-list']}>
              <MessageSeparator type="date" label="Today" />

              <Message
                avatarSrc={avatarSofia}
                avatarAlt="Sofia Bauer"
                username="Sofia Bauer"
                timestamp="9:02 AM"
              >
                <p className={shellStyles['channel-shell__post-text']}>
                  Morning everyone! Reminder that the Q2 roadmap review is at
                  10:30 today. Agenda is in the thread below.
                </p>
              </Message>

              <Message
                avatarSrc={avatarMarco}
                avatarAlt="Marco Rinaldi"
                username="Marco Rinaldi"
                timestamp="9:14 AM"
              >
                <p className={shellStyles['channel-shell__post-text']}>
                  Just pushed the updated onboarding flow to staging — would
                  love a second pair of eyes on the empty states before we cut a
                  release.
                </p>
              </Message>

              <Message
                avatarSrc={avatarDanielle}
                avatarAlt="Mattermost"
                username="Mattermost"
                timestamp="9:20 AM"
                isBot
              >
                <p className={shellStyles['channel-shell__post-text']}>
                  Build #2847 succeeded on <code>main</code>. Deploy to staging
                  completed in 3m 12s.
                </p>
              </Message>

              <Message
                avatarSrc={avatarAikoTan}
                avatarAlt="Aiko Tan"
                username="Aiko Tan"
                timestamp="9:33 AM"
              >
                <p className={shellStyles['channel-shell__post-text']}>
                  Nice work Marco 🎉 I can take a pass after standup. The new
                  illustrations really tie the whole flow together.
                </p>
                <ReactionsRow
                  reactions={[
                    { emoji: '🎉', count: 4, byCurrentUser: true },
                    { emoji: '👀', count: 2 },
                  ]}
                  showAddReaction
                />
              </Message>

              <Message
                avatarSrc={avatarArjunPatel}
                avatarAlt="Arjun Patel"
                username="Arjun Patel"
                timestamp="9:47 AM"
              >
                <p className={shellStyles['channel-shell__post-text']}>
                  Heads up — I'll be out Friday afternoon. If anything urgent
                  comes up with the ingest pipeline, ping Leila first.
                </p>
              </Message>

              <MessageSeparator type="new-messages" />

              <Message
                avatarSrc={avatarLeonard}
                avatarAlt="Leonard Riley"
                username="Leonard Riley"
                timestamp="10:12 AM"
              >
                <p className={shellStyles['channel-shell__post-text']}>
                  Design review is bumped to 2:00 PM today — conflict with the
                  roadmap meeting. Same room.
                </p>
              </Message>
            </div>
          </Scrollbar>
        </div>

        <div className={shellStyles['channel-shell__message-input']}>
          <MessageInput placeholder="Write to Town Square" />
        </div>
      </>
    </ChannelShell>
  );
}
