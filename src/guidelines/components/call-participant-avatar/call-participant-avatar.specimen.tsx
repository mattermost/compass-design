import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import { CallParticipantAvatar } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/components.module.scss';

export default function CallParticipantAvatarLibrary() {
  return (
    <>
      <div
        className={`${styles['components__button-block']} ${styles['components__button-block--calls-bg']}`}
      >
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <CallParticipantAvatar
            src={avatarLeonard}
            alt="Leonard Riley"
            size="x-small"
            name="Leonard R."
          />
          <CallParticipantAvatar
            src={avatarDanielle}
            alt="Danielle Okoro"
            size="small"
            name="Danielle O."
          />
          <CallParticipantAvatar
            src={avatarMarco}
            alt="Marco Rinaldi"
            size="medium"
            name="Marco R."
          />
          <CallParticipantAvatar
            src={avatarEmma}
            alt="Emma Novak"
            size="large"
            name="Emma N."
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
          <CallParticipantAvatar
            src={avatarLeonard}
            alt="Leonard Riley"
            size="small"
            muteState="muted"
            name="Muted"
          />
          <CallParticipantAvatar
            src={avatarDanielle}
            alt="Danielle Okoro"
            size="small"
            muteState="unmuted"
            name="Unmuted"
            talking
          />
          <CallParticipantAvatar
            src={avatarMarco}
            alt="Marco Rinaldi"
            size="small"
            host
            name="Host"
          />
          <CallParticipantAvatar
            src={avatarEmma}
            alt="Emma Novak"
            size="small"
            reaction="🎉"
            name="Reaction"
          />
        </div>
      </div>
    </>
  );
}
