import { useState } from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import {
  QuickSwitchModal,
  cyberDefenseChannels,
  cyberDefenseCurrentUserId,
  getCyberDefenseUser,
  type FixtureChannel,
  type QuickSwitchItem,
} from '@mattermost/compass-proto';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { avatars } from '@/fixtures/avatarRegistry';
import styles from '@/styles/library-demo/patterns.module.scss';

const me = cyberDefenseCurrentUserId;

/** How many channels the "Recent" group lists. */
const RECENT_COUNT = 6;

function toItem(channel: FixtureChannel, group: string): QuickSwitchItem {
  if (channel.type === 'direct') {
    const otherId = channel.memberIds?.find((id) => id !== me);
    const other = otherId ? getCyberDefenseUser(otherId) : undefined;
    return {
      id: channel.id,
      name: channel.name,
      kind: 'direct-message',
      secondaryLabel: other ? `@${other.username}` : undefined,
      group,
      leadingVisual: (
        <UserAvatar
          src={otherId ? avatars[otherId] : undefined}
          alt=""
          size="20"
        />
      ),
    };
  }
  return {
    id: channel.id,
    name: channel.name,
    kind: 'channel',
    secondaryLabel: `~${channel.id.split('/').pop()}`,
    group,
  };
}

// The signed-in user's conversations: those with unread posts first, then a
// few more. Group messages are left out (the switcher lists channels and people).
const mine = cyberDefenseChannels.filter(
  (c) => c.memberIds?.includes(me) && c.type !== 'group',
);
const unread = mine.filter((c) => c.unreadCount);
const recent = mine.filter((c) => !c.unreadCount).slice(0, RECENT_COUNT);
const quickSwitchItems: QuickSwitchItem[] = [
  ...unread.map((c) => toItem(c, 'Unread')),
  ...recent.map((c) => toItem(c, 'Recent')),
];

/** Stages the real overlay inside the canvas frame instead of the page. */
export function QuickSwitchModalCanvas() {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  return (
    <div style={{ width: '100%' }}>
      <div
        ref={setStage}
        className={[
          styles['patterns__modal-canvas'],
          styles['patterns__modal-canvas--tall'],
        ].join(' ')}
      >
        {stage && (
          <QuickSwitchModal
            open={open}
            overlayProps={{
              container: stage,
              lockScroll: false,
              style: { position: 'absolute' },
            }}
            items={quickSwitchItems}
            onClose={() => setOpen(false)}
            onSelect={(item) => setSelected(item.name)}
          />
        )}
      </div>
      {!open && (
        <Button emphasis="tertiary" onClick={() => setOpen(true)}>
          Reopen quick switcher
        </Button>
      )}
      <p className={styles['patterns__variant-label']}>
        {selected ? `Selected: ${selected}` : 'Press Enter or click a row'}
      </p>
    </div>
  );
}

export default QuickSwitchModalCanvas;
