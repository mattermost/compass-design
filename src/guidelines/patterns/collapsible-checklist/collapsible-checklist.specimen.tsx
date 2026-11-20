import { useState } from 'react';
import {
  CollapsibleChecklist,
  type ChecklistItemData,
} from '@mattermost/compass-proto';
import aiko from '@/assets/avatars/Aiko Tan.png';
import leonard from '@/assets/avatars/Leonard Riley.png';
import styles from '@/styles/library-demo/patterns.module.scss';

const seed: ChecklistItemData[] = [
  {
    id: '1',
    title: 'Declare the incident',
    state: 'closed',
    checkedBy: { name: 'Leonard Riley', src: leonard },
  },
  {
    id: '2',
    title: 'Page the security on-call',
    description: 'Use the primary rotation first.',
    state: 'open',
    assignee: { name: 'Aiko Tan', src: aiko },
    dueDate: 'Tomorrow',
  },
  {
    id: '3',
    title: 'Start the bridge',
    state: 'open',
    command: '/zoom start',
  },
  {
    id: '4',
    title: 'Optional customer email',
    state: 'skipped',
  },
];

function InteractiveChecklist() {
  const [items, setItems] = useState(seed);
  return (
    <CollapsibleChecklist
      title="Triage"
      items={items}
      onItemsChange={setItems}
      onRename={() => {}}
      onDuplicate={() => {}}
      onDelete={() => {}}
    />
  );
}

export default function CollapsibleChecklistLibrary() {
  return (
    <div className={styles['patterns__collapsible-checklist-demo']}>
      <p className={styles['patterns__variant-label']}>
        Interactive (collapse, check, add)
      </p>
      <InteractiveChecklist />

      <p className={styles['patterns__variant-label']}>Starts collapsed</p>
      <CollapsibleChecklist
        title="Remediation"
        defaultCollapsed
        defaultItems={[
          { id: 'a', title: 'Patch the affected hosts', state: 'open' },
          { id: 'b', title: 'Verify monitoring', state: 'open' },
        ]}
      />

      <p className={styles['patterns__variant-label']}>Read-only</p>
      <CollapsibleChecklist
        title="Communication"
        readOnly
        defaultItems={[
          {
            id: 'c',
            title: 'Post a status update',
            state: 'closed',
            checkedBy: { name: 'Leonard Riley', src: leonard },
          },
          {
            id: 'd',
            title: 'Notify stakeholders',
            state: 'open',
            assignee: { name: 'Aiko Tan', src: aiko },
          },
        ]}
      />
    </div>
  );
}
