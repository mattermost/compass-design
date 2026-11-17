import { useMemo, useRef, useState } from 'react';
import { useStickToBottom } from '@/hooks/useStickToBottom';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  ChannelHeaderMenu,
  ChannelShell,
  MessageInput,
  RightSidebarChannelInfo,
  buildChannelsSidebarModelFromFixtures,
  cyberDefenseChannels,
  cyberDefenseCurrentUserId,
  cyberDefensePosts,
  cyberDefenseTeam,
  cyberDefenseUsers,
  getCyberDefenseUser,
  shellStyles,
  type ChannelBookmark,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import AnchoredMenuHost from '@/guidelines/_components/AnchoredMenuHost';
import ChannelBookmarksDemo, {
  type ChannelBookmarksDemoHandle,
} from '@/guidelines/_components/ChannelBookmarksDemo';
import {
  FixtureChannelBanner,
  FixtureChannelHeader,
  FixtureMessageList,
} from '@/guidelines/_components/FixtureChannel';
import { fixtureChannelInfoProps } from '@/guidelines/_components/fixtureChannelInfoProps';

// Everything on this page comes from the Cyber Defense HQ fixtures, from the
// point of view of the sample workspace's signed-in user.
const visibleChannels = cyberDefenseChannels.filter((c) =>
  c.memberIds?.includes(cyberDefenseCurrentUserId),
);
// Open on a channel with alert cards when there is one: it shows the most.
const defaultChannelId = (
  visibleChannels.find((c) =>
    cyberDefensePosts.some(
      (p) => p.channelId === c.id && p.kind === 'slack-attachment',
    ),
  ) ?? visibleChannels[0]
)?.id;
const threadsMentionCount = cyberDefensePosts.reduce(
  (n, p) => n + (p.unreadMentions ?? 0),
  0,
);

export default function ChannelLayout() {
  const [activeChannelId, setActiveChannelId] = useState(defaultChannelId);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const bookmarksRef = useRef<ChannelBookmarksDemoHandle>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const channel =
    visibleChannels.find((c) => c.id === activeChannelId) ?? visibleChannels[0];
  // Open each channel on its newest message and keep it there.
  const messagesRef = useStickToBottom(channel?.id);

  const sidebarModel = useMemo(
    () =>
      buildChannelsSidebarModelFromFixtures({
        channels: cyberDefenseChannels,
        users: cyberDefenseUsers,
        currentUserId: cyberDefenseCurrentUserId,
        activeChannelId: channel?.id,
        avatars,
        threadsMentionCount,
        onSelectChannel: setActiveChannelId,
      }),
    [channel?.id],
  );
  if (!channel) return null;

  const bookmarks: ChannelBookmark[] = (channel.bookmarks ?? []).map((b) => ({
    id: b.id,
    label: b.label,
    labelText: b.label,
    href: b.href,
    emoji: b.emoji,
  }));
  const me = getCyberDefenseUser(cyberDefenseCurrentUserId);

  return (
    <ChannelShell
      teams={[cyberDefenseTeam]}
      activeTeamId={cyberDefenseTeam.id}
      teamName={cyberDefenseTeam.name}
      userAvatarSrc={avatars[cyberDefenseCurrentUserId]}
      userAvatarAlt={me?.displayName}
      channelsSidebarModel={sidebarModel}
      channelHeader={
        <>
          <FixtureChannelHeader
            channel={channel}
            onNameClick={(e) => {
              const trigger = e.currentTarget;
              setMenuAnchor((current) => (current ? null : trigger));
            }}
            onInfoClick={() => setRightSidebarOpen((o) => !o)}
            infoToggled={rightSidebarOpen}
          />
          <ChannelBookmarksDemo
            key={channel.id}
            ref={bookmarksRef}
            initial={bookmarks}
          />
          <AnchoredMenuHost
            anchor={menuAnchor}
            onClose={() => setMenuAnchor(null)}
          >
            <ChannelHeaderMenu
              onAddBookmark={(type) => {
                // Hand focus back to the trigger first so the modal can restore it.
                menuAnchor?.focus();
                setMenuAnchor(null);
                bookmarksRef.current?.openAdd(type);
              }}
            />
          </AnchoredMenuHost>
        </>
      }
      trailing={
        rightSidebarOpen ? (
          <aside className={shellStyles['channel-shell__right-sidebar']}>
            <RightSidebarHeader
              title="Channel Info"
              secondaryTitle={channel.name}
              onClose={() => setRightSidebarOpen(false)}
            />
            <div className={shellStyles['channel-shell__right-sidebar-body']}>
              <Scrollbar>
                <RightSidebarChannelInfo
                  {...fixtureChannelInfoProps(channel)}
                />
              </Scrollbar>
            </div>
          </aside>
        ) : undefined
      }
    >
      <>
        <FixtureChannelBanner channel={channel} />
        <div className={shellStyles['channel-shell__messages']}>
          <Scrollbar key={channel.id} ref={messagesRef}>
            <div className={shellStyles['channel-shell__messages-list']}>
              <FixtureMessageList
                channel={channel}
                channels={cyberDefenseChannels}
              />
            </div>
          </Scrollbar>
        </div>

        <div className={shellStyles['channel-shell__message-input']}>
          <MessageInput placeholder={`Write to ${channel.name}`} />
        </div>
      </>
    </ChannelShell>
  );
}
