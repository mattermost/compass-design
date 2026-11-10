import { useState } from 'react';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import CreationOutlineIcon from '@mattermost/compass-icons/components/creation-outline';
import FileTextOutlineIcon from '@mattermost/compass-icons/components/file-text-outline';
import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import PoundIcon from '@mattermost/compass-icons/components/pound';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { SegmentedControl } from '@mattermost/compass-ui/components/segmented-control';
import type { SegmentedControlOption } from '@mattermost/compass-ui/components/segmented-control';
import styles from '@/styles/library-demo/components.module.scss';

const SEARCH_MODES: SegmentedControlOption[] = [
  { key: 'channels', label: 'Channels', icon: <Icon glyph={<PoundIcon />} /> },
  {
    key: 'messages',
    label: 'Messages',
    icon: <Icon glyph={<MessageTextOutlineIcon />} />,
  },
  {
    key: 'files',
    label: 'Files',
    icon: <Icon glyph={<FileTextOutlineIcon />} />,
  },
  {
    key: 'people',
    label: 'People',
    icon: <Icon glyph={<AccountOutlineIcon />} />,
  },
  {
    key: 'copilot',
    label: 'Copilot',
    icon: <Icon glyph={<CreationOutlineIcon />} />,
  },
];

function SearchModes() {
  const [value, setValue] = useState('messages');
  return (
    <SegmentedControl
      aria-label="Search mode"
      options={SEARCH_MODES}
      value={value}
      onChange={setValue}
    />
  );
}

function Range() {
  const [value, setValue] = useState('week');
  return (
    <SegmentedControl
      aria-label="Calendar range"
      role="radiogroup"
      options={[
        { key: 'day', label: 'Day' },
        { key: 'week', label: 'Week' },
        { key: 'month', label: 'Month' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

export default function SegmentedControlLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>
          View switcher
        </span>
        <SearchModes />
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>
          Form choice
        </span>
        <Range />
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Disabled</span>
        <SegmentedControl
          aria-label="Search mode"
          value="channels"
          onChange={() => {}}
          options={[
            { key: 'channels', label: 'Channels' },
            { key: 'messages', label: 'Messages' },
            {
              key: 'files',
              label: 'Files',
              disabled: true,
              title: 'Files search is unavailable',
            },
          ]}
        />
      </div>
    </div>
  );
}
