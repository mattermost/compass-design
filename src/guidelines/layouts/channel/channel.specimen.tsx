import { useRef, useState } from 'react';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  ChannelHeaderMenu,
  ChannelShell,
  MessageInput,
  RightSidebarChannelInfo,
  shellStyles,
  type ChannelBookmark,
} from '@mattermost/compass-proto';
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
import { useFixtureWorkspace } from '@/guidelines/_components/useFixtureWorkspace';

// Everything on this page comes from the sample workspace fixtures, from the
// point of view of its signed-in user: three teams to switch between, each with
// its own channels, and the direct messages they share.
export default function ChannelLayout() {
  const { channel, channels, messagesRef, shellProps } = useFixtureWorkspace();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const bookmarksRef = useRef<ChannelBookmarksDemoHandle>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  if (!channel) return null;

  const bookmarks: ChannelBookmark[] = (channel.bookmarks ?? []).map((b) => ({
    id: b.id,
    label: b.label,
    labelText: b.label,
    href: b.href,
    emoji: b.emoji,
  }));

  return (
    <ChannelShell
      {...shellProps}
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
              <FixtureMessageList channel={channel} channels={channels} />
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
