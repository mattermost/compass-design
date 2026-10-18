import EyeOutlineIcon from '@mattermost/compass-icons/components/eye-outline';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { TextInput } from '@mattermost/compass-ui/components/text-input';
import styles from '@/styles/library-demo/components.module.scss';

export default function TextInputLibrary() {
  return (
    <>
      <p
        className={styles['components__subheading']}
        style={{ marginBottom: 'var(--spacing-m)' }}
      >
        Figma Text Input v2.0.1 (Border=On). Floating label when{' '}
        <code>label</code> is provided: resting when empty/unfocused, floated
        when focused or has value. Theme variables only.
      </p>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <TextInput size="small" placeholder="small" />
          <TextInput size="medium" placeholder="medium" />
          <TextInput size="large" placeholder="large" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            With / without label
          </span>
          <TextInput label="Label" placeholder="Placeholder" />
          <TextInput placeholder="No label" />
          <TextInput label="With value" defaultValue="Some text" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Leading / trailing icons
          </span>
          <TextInput
            label="Search"
            placeholder="Search..."
            leadingIcon={<Icon glyph={<GlobeIcon />} />}
          />
          <TextInput
            placeholder="Trailing only"
            trailingIcon={<Icon glyph={<GlobeIcon />} />}
          />
          <TextInput
            label="Both"
            placeholder="Leading and trailing"
            leadingIcon={<Icon glyph={<GlobeIcon />} />}
            trailingIcon={<Icon glyph={<GlobeIcon />} />}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Invalid</span>
          <TextInput label="Error" invalid placeholder="Invalid state" />
          <TextInput
            label="Error with message"
            defaultValue="Invalid"
            message="Enter a valid value."
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Character counter
          </span>
          <TextInput
            label="Description"
            placeholder="Enter text..."
            maxLength={100}
            showCharacterCount
          />
          <TextInput
            label="With value"
            defaultValue="Already filled"
            maxLength={50}
            showCharacterCount
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Disabled & read-only
          </span>
          <TextInput label="Disabled" disabled placeholder="Disabled" />
          <TextInput
            label="Read-only"
            readOnly
            defaultValue="Read only value"
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Field message
          </span>
          <TextInput label="Error" message="This field is required." />
          <TextInput
            label="Warning"
            message="This name is taken."
            messageTone="warning"
          />
          <TextInput
            label="Info"
            message="Use 8 or more characters."
            messageTone="info"
          />
          <TextInput
            label="Success"
            message="Looks good."
            messageTone="success"
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Field message + counter
          </span>
          <TextInput
            label="Bio"
            message="Too long"
            defaultValue="Hello world"
            maxLength={20}
            showCharacterCount
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Clearable
          </span>
          <TextInput label="Filter" clearable defaultValue="design" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Trailing icon (password)
          </span>
          <TextInput
            label="Password"
            type="password"
            defaultValue="secret-value"
            trailingIcon={
              <IconButton
                aria-label="Show password"
                icon={<Icon glyph={<EyeOutlineIcon />} />}
              />
            }
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Trailing action
          </span>
          <TextInput
            label="Invite code"
            defaultValue="abc-123"
            message="Copied to clipboard."
            messageTone="success"
            trailingAction={<Button>Copy</Button>}
          />
        </div>
      </div>
    </>
  );
}
