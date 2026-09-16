import { MenuGroupHeading } from '@mattermost/compass-ui/components/menu-group-heading';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { Divider } from '@mattermost/compass-ui/components/divider';
import styles from '@/styles/library-demo/components.module.scss';

export default function MenuGroupHeadingLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Default</span>
          <div className={styles['components__menu-demo']}>
            <MenuGroupHeading label="Section heading" />
          </div>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>In a menu</span>
          <div className={styles['components__menu-demo']}>
            <MenuGroupHeading label="Preferences" />
            <MenuItem label="Theme" leadingElement={false} />
            <MenuItem label="Language" leadingElement={false} />
            <MenuItem label="Time zone" leadingElement={false} />
            <Divider />
            <MenuGroupHeading label="Notifications" />
            <MenuItem label="Desktop alerts" leadingElement={false} />
            <MenuItem label="Mobile push" leadingElement={false} />
          </div>
        </div>
      </div>
    </>
  );
}
