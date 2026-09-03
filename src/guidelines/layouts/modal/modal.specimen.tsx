import { useState } from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import { defaultChannelsSidebarDemoModel } from '@/fixtures/channelsSidebarDemo';
import { MessageReactions } from '@mattermost/compass-ui/components/message-reactions';
import { MessageSeparator } from '@mattermost/compass-ui/components/message-separator';
import { Modal } from '@mattermost/compass-ui/components/modal';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarAikoTan from '@/assets/avatars/Aiko Tan.png';
import avatarArjunPatel from '@/assets/avatars/Arjun Patel.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import styles from './modal.specimen.module.scss';
import { ChannelHeader, ChannelShell, MessageInput, Message, RightSidebarChannelInfo, shellStyles } from '@mattermost/compass-proto';

export default function ModalLayout() {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const modalFooter = (
    <>
      <Button emphasis="tertiary">Cancel</Button>
      <Button emphasis="primary" destructive>
        Delete
      </Button>
    </>
  );

  return (
    <ChannelShell
      channelsSidebarModel={defaultChannelsSidebarDemoModel}
      channelHeader={
        <ChannelHeader
          type="channel"
          name="Town Square"
          description="Company-wide announcements and general discussion."
          memberCount={124}
          pinnedCount={2}
          onInfoClick={() => setRightSidebarOpen((o) => !o)}
          infoToggled={rightSidebarOpen}
        />
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
      overlay={
        <div className={styles['modal-layout']}>
          <div className={styles['modal-layout__backdrop']} aria-hidden />
          <div className={styles['modal-layout__dialog']}>
            <Modal
              title="Delete category"
              size="small"
              headerDivider={false}
              footerDivider={false}
              onClose={() => undefined}
              footer={modalFooter}
            >
              <p className={styles['modal-layout__body-text']}>
                Channels in{' '}
                <span className={styles['modal-layout__body-emphasis']}>
                  Active Projects
                </span>{' '}
                will move back to the Channels and Direct messages categories. You
                won’t be removed from channels.
              </p>
            </Modal>
          </div>
        </div>
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
                  Morning everyone! Reminder that the Q2 roadmap review is at 10:30
                  today. Agenda is in the thread below.
                </p>
              </Message>

              <Message
                avatarSrc={avatarMarco}
                avatarAlt="Marco Rinaldi"
                username="Marco Rinaldi"
                timestamp="9:14 AM"
              >
                <p className={shellStyles['channel-shell__post-text']}>
                  Just pushed the updated onboarding flow to staging — would love a
                  second pair of eyes on the empty states before we cut a release.
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
                <MessageReactions
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
                  Heads up — I'll be out Friday afternoon. If anything urgent comes
                  up with the ingest pipeline, ping Leila first.
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
                  Design review is bumped to 2:00 PM today — conflict with the roadmap
                  meeting. Same room.
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
