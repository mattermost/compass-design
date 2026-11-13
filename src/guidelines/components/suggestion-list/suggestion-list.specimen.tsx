import { SuggestionList } from '@mattermost/compass-ui/components/suggestion-list';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import styles from '@/styles/library-demo/components.module.scss';

const avatar = (
  src: string,
  name: string,
  status: 'online' | 'away' | 'offline',
) => <UserAvatar size="24" src={src} alt="" name={name} status={status} />;

export default function SuggestionListLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Mentions</span>
        <div style={{ width: 400 }}>
          <SuggestionList
            activeValue="emma"
            options={[
              {
                value: 'emma',
                label: 'emma.novak',
                secondaryLabel: 'Emma Novak',
                leadingVisual: avatar(avatarEmma, 'Emma Novak', 'online'),
              },
              {
                value: 'arjun',
                label: 'arjun.patel',
                secondaryLabel: 'Arjun Patel',
                leadingVisual: avatar(avatarArjun, 'Arjun Patel', 'away'),
              },
            ]}
          />
        </div>
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>
          Grouped, not in channel
        </span>
        <div style={{ width: 400 }}>
          <SuggestionList
            activeValue="emma"
            sections={[
              {
                key: 'members',
                heading: 'Channel members',
                options: [
                  {
                    value: 'emma',
                    label: 'emma.novak',
                    secondaryLabel: 'Emma Novak',
                    leadingVisual: avatar(avatarEmma, 'Emma Novak', 'online'),
                  },
                ],
              },
              {
                key: 'others',
                heading: 'Not in channel',
                options: [
                  {
                    value: 'sofia',
                    label: 'sofia.bauer',
                    secondaryLabel: 'Sofia Bauer',
                    leadingVisual: avatar(
                      avatarSofia,
                      'Sofia Bauer',
                      'offline',
                    ),
                    trailingLabel: 'Not in channel',
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
