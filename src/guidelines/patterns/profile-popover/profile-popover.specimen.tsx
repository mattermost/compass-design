import {
  cyberDefenseCurrentUserId,
  cyberDefenseUsers,
  getCyberDefenseUser,
  type FixtureUser,
} from '@mattermost/compass-proto';
import { ProfilePopover } from '@mattermost/compass-ui/components/profile-popover';
import { avatars } from '@/fixtures/avatarRegistry';
import styles from '@/styles/library-demo/patterns.module.scss';

// People come from the sample workspace; the popover's own extras (local time,
// last online, staff and committer badges) are written here, as the sample data
// has no such fields.
const you =
  getCyberDefenseUser(cyberDefenseCurrentUserId) ?? cyberDefenseUsers[0]!;
const people = cyberDefenseUsers.filter(
  (u) => u.id !== you.id && !u.isBot && u.position,
);
const other = people.find((u) => !u.customStatusText) ?? people[0] ?? you;
const otherWithStatus = people.find((u) => u.customStatusText) ?? other;

const identity = (user: FixtureUser) => ({
  avatarSrc: avatars[user.id],
  avatarAlt: user.displayName,
  name: user.displayName,
  username: `@${user.username}`,
  title: user.position,
  email: `${user.username}@example.com`,
  lastOnline: 'Last online 6 hrs ago',
});

const localTime = {
  time: '10:42 PM',
  timezone: 'EST',
  hourDifference: '3 hrs behind',
};

const customStatus = (user: FixtureUser) =>
  user.customStatusText
    ? {
        emoji: user.customStatusEmoji ?? '📅',
        text: user.customStatusText,
        expiresLabel: 'Until Tomorrow',
      }
    : { emoji: '📅', text: 'In a meeting', expiresLabel: 'Until Tomorrow' };

export default function ProfilePopoverLibrary() {
  return (
    <div className={styles['patterns__profile-popover-demo']}>
      <div>
        <p className={styles['patterns__variant-label']}>Others — full</p>
        <ProfilePopover
          user="others"
          {...identity(other)}
          staff
          localTime={localTime}
          onClose={() => {}}
        />
      </div>
      <div>
        <p className={styles['patterns__variant-label']}>
          Others — with custom status + extras
        </p>
        <ProfilePopover
          user="others"
          {...identity(otherWithStatus)}
          sharedOrg="Acme Corp."
          staff
          coreCommitter
          githubHandle={otherWithStatus.username.replace('.', '')}
          localTime={localTime}
          customStatus={customStatus(otherWithStatus)}
          onClose={() => {}}
        />
      </div>
      <div>
        <p className={styles['patterns__variant-label']}>You</p>
        <ProfilePopover
          user="you"
          {...identity(you)}
          staff
          localTime={localTime}
          onClose={() => {}}
        />
      </div>
      <div>
        <p className={styles['patterns__variant-label']}>
          You — with custom status + extras
        </p>
        <ProfilePopover
          user="you"
          {...identity(you)}
          sharedOrg="Acme Corp."
          staff
          coreCommitter
          githubHandle={you.username.replace('.', '')}
          localTime={localTime}
          customStatus={customStatus(you)}
          onClose={() => {}}
        />
      </div>
    </div>
  );
}
