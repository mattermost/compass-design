import { useState } from 'react';
import {
  ChecklistItem,
  type ChecklistItemData,
} from '@mattermost/compass-proto';
import leonard from '@/assets/avatars/Leonard Riley.png';
import styles from '@/styles/library-demo/patterns.module.scss';

const withMeta: ChecklistItemData = {
  id: 'meta',
  title: 'Page the security on-call',
  description: 'Use the primary rotation first.',
  state: 'open',
  assignee: { name: 'Leonard Riley', src: leonard },
  dueDate: 'Tomorrow',
  command: '/zoom start',
};

export default function ChecklistItemLibrary() {
  const [item, setItem] = useState<ChecklistItemData>(withMeta);
  const [draft, setDraft] = useState<ChecklistItemData>({
    id: 'draft',
    title: '',
    description: '',
    state: 'open',
  });

  return (
    <div className={styles['patterns__checklist-item-demo']}>
      <p className={styles['patterns__variant-label']}>Interactive</p>
      <ChecklistItem
        item={item}
        onStateChange={(state) => setItem((prev) => ({ ...prev, state }))}
      />

      <p className={styles['patterns__variant-label']}>Closed</p>
      <ChecklistItem
        item={{
          id: 'closed',
          title: 'Declare the incident channel',
          state: 'closed',
          checkedBy: { name: 'Leonard Riley', src: leonard },
        }}
      />

      <p className={styles['patterns__variant-label']}>Skipped</p>
      <ChecklistItem
        item={{
          id: 'skipped',
          title: 'Optional follow-up email',
          state: 'skipped',
        }}
      />

      <p className={styles['patterns__variant-label']}>Editing (add a task)</p>
      <ChecklistItem
        item={draft}
        editing
        showDragHandle={false}
        onTitleChange={(title) => setDraft((prev) => ({ ...prev, title }))}
        onDescriptionChange={(description) =>
          setDraft((prev) => ({ ...prev, description }))
        }
        onSave={() =>
          setDraft({
            id: 'draft',
            title: '',
            description: '',
            state: 'open',
          })
        }
        onCancel={() =>
          setDraft({
            id: 'draft',
            title: '',
            description: '',
            state: 'open',
          })
        }
      />
    </div>
  );
}
