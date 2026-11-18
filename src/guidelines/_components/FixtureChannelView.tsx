import { useRef, useState, type ReactNode } from 'react';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  ChannelHeaderMenu,
  ChannelShell,
  MessageInput,
  RightSidebar,
  RightSidebarChannelInfo,
  RightSidebarThread,
  shellStyles,
  type ChannelBookmark,
  type FixtureChannel,
  type FixtureTeam,
} from '@mattermost/compass-proto';
import AnchoredMenuHost from './AnchoredMenuHost';
import ChannelBookmarksDemo, {
  type ChannelBookmarksDemoHandle,
} from './ChannelBookmarksDemo';
import {
  FixtureChannelBanner,
  FixtureChannelHeader,
  FixtureMessageList,
} from './FixtureChannel';
import { fixtureChannelInfoProps } from './fixtureChannelInfoProps';
import { threadMessages, threadsIn } from './fixtureThread';
import { useFixtureWorkspace } from './useFixtureWorkspace';

export interface FixtureChannelViewContext {
  channel: FixtureChannel;
  team: FixtureTeam | undefined;
}

export interface FixtureChannelViewProps {
  /** Right sidebar open on first render. Default: closed. */
  rightSidebar?: 'info' | 'thread';
  /** Layered over the whole shell, such as a modal. */
  overlay?: (context: FixtureChannelViewContext) => ReactNode;
  /** In-channel floating UI, such as the call widget. */
  floating?: (context: FixtureChannelViewContext) => ReactNode;
  /** Team to open on. Default: the first. */
  initialTeamId?: string;
}

/**
 * A whole channel view from the sample workspace, for layouts to show: the
 * Team Sidebar (switching teams), channel sidebar, header and bookmarks bar,
 * channel banner, messages, composer, and a Channel Info or Thread panel on
 * the right (clicking a thread's replies opens it). The layouts that differ
 * only in what is open or layered on top (Channel, Channel info, Channel
 * thread, Modal, Call widget) are this with different props.
 */
export default function FixtureChannelView({
  rightSidebar,
  overlay,
  floating,
  initialTeamId,
}: FixtureChannelViewProps) {
  const { team, channel, channels, messagesRef, shellProps } =
    useFixtureWorkspace({ initialTeamId });
  const [panel, setPanel] = useState<'none' | 'info' | 'thread'>(
    rightSidebar ?? 'none',
  );
  const [threadRootId, setThreadRootId] = useState<string>();
  const bookmarksRef = useRef<ChannelBookmarksDemoHandle>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  if (!channel) return null;

  // The open thread, if it is in this channel; else the channel's first one
  // when the thread panel is asked for.
  const threads = threadsIn(new Set([channel.id]));
  const thread =
    panel === 'thread'
      ? (threads.find((t) => t.root.id === threadRootId) ?? threads[0])
      : undefined;
  const shownPanel = panel === 'thread' && !thread ? 'none' : panel;

  const bookmarks: ChannelBookmark[] = (channel.bookmarks ?? []).map((b) => ({
    id: b.id,
    label: b.label,
    labelText: b.label,
    href: b.href,
    emoji: b.emoji,
  }));
  const context = { channel, team };

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
            onInfoClick={() =>
              setPanel((p) => (p === 'info' ? 'none' : 'info'))
            }
            infoToggled={shownPanel === 'info'}
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
        shownPanel === 'info' ? (
          <aside className={shellStyles['channel-shell__right-sidebar']}>
            <RightSidebarHeader
              title="Channel Info"
              secondaryTitle={channel.name}
              onClose={() => setPanel('none')}
            />
            <div className={shellStyles['channel-shell__right-sidebar-body']}>
              <Scrollbar>
                <RightSidebarChannelInfo
                  {...fixtureChannelInfoProps(channel)}
                />
              </Scrollbar>
            </div>
          </aside>
        ) : thread ? (
          <RightSidebar
            alignBody="end"
            className={shellStyles['channel-shell__right-sidebar']}
            header={
              <RightSidebarHeader
                title="Thread"
                secondaryTitle={channel.name}
                actionLabel={thread.following ? 'Following' : undefined}
                actionActive={thread.following}
                onClose={() => setPanel('none')}
              />
            }
            footer={
              <div className={shellStyles['channel-shell__message-input']}>
                <MessageInput placeholder="Reply to thread…" width="narrow" />
              </div>
            }
          >
            <RightSidebarThread messages={threadMessages(thread)} />
          </RightSidebar>
        ) : undefined
      }
      floating={floating?.(context)}
      overlay={overlay?.(context)}
    >
      <>
        <FixtureChannelBanner channel={channel} />
        <div className={shellStyles['channel-shell__messages']}>
          <Scrollbar key={channel.id} ref={messagesRef}>
            <div className={shellStyles['channel-shell__messages-list']}>
              <FixtureMessageList
                channel={channel}
                channels={channels}
                onOpenThread={(id) => {
                  setThreadRootId(id);
                  setPanel('thread');
                }}
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
