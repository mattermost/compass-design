import { PasswordInput } from '@mattermost/compass-ui/components/password-input';
import styles from '@/styles/library-demo/components.module.scss';

export default function PasswordInputLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <PasswordInput size="small" label="Small" defaultValue="secret" />
          <PasswordInput size="medium" label="Medium" defaultValue="secret" />
          <PasswordInput size="large" label="Large" defaultValue="secret" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            With label
          </span>
          <PasswordInput label="Password" placeholder="Enter your password" />
          <PasswordInput label="With value" defaultValue="secret-value" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
          <PasswordInput
            label="No reveal toggle"
            defaultValue="secret-value"
            revealToggle={false}
          />
          <PasswordInput
            label="Revealed"
            defaultValue="secret-value"
            defaultRevealed
          />
          <PasswordInput
            label="Disabled"
            disabled
            defaultValue="secret-value"
          />
          <PasswordInput label="Invalid" defaultValue="wrong" invalid />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Field message
          </span>
          <PasswordInput
            label="Password"
            message="Use 8 or more characters."
            messageTone="info"
          />
          <PasswordInput
            label="Password"
            defaultValue="wrong"
            message="Password is incorrect."
          />
        </div>
      </div>
    </>
  );
}
