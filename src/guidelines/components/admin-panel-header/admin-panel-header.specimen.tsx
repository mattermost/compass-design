import { useState } from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import { type AdminPanelExpandedState } from '@mattermost/compass-ui/components/admin-panel-header';
import { AdminPanel } from '@mattermost/compass-ui/components/admin-panel';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import styles from '@/styles/library-demo/components.module.scss';

export default function AdminPanelHeaderLibrary() {
  const [expanded, setExpanded] = useState<AdminPanelExpandedState>('expanded');

  return (
    <div className={styles['components__button-block']}>
      <div>
        <p className={styles['components__instance-label']}>Full header</p>
        <AdminPanel
          title="Section Title"
          subtitle="Section sub-title"
          iconLeft
          showEnterpriseLabel
          showBeta
          showSwitch
          switchLabel="Off"
          showButton
          buttonLabel="Button"
        />
      </div>
      <div>
        <p className={styles['components__instance-label']}>
          Expandable, collapsed
        </p>
        <AdminPanel
          title="Section Title"
          subtitle="Section sub-title"
          expandable
          defaultExpandedState="collapsed"
          showSwitch
          switchLabel="Off"
        />
      </div>
      <div>
        <p className={styles['components__instance-label']}>
          Controlled expand + custom icon + help action
        </p>
        <AdminPanel
          title="Section Title"
          subtitle="Section sub-title"
          iconLeft
          leadingIcon={<Icon size="20" glyph={<GlobeIcon />} />}
          expandable
          expandedState={expanded}
          onExpandedStateChange={setExpanded}
          headerActions={
            <IconButton
              type="button"
              style="default"
              size="medium"
              aria-label="Help"
              icon={<Icon size="20" glyph={<InformationOutlineIcon />} />}
            />
          }
        />
      </div>
      <div>
        <p className={styles['components__instance-label']}>
          Title + subtitle only
        </p>
        <AdminPanel title="Section Title" subtitle="Section sub-title" />
      </div>
      <div>
        <p className={styles['components__instance-label']}>Title only</p>
        <AdminPanel title="Section Title" />
      </div>
    </div>
  );
}
