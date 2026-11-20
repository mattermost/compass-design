import { useState } from 'react';
import {
  ChecklistItem,
  type ChecklistItemData,
} from '@mattermost/compass-proto';
import leonard from '@/assets/avatars/Leonard Riley.png';
import styles from '@/styles/library-demo/components.module.scss';

const withMeta: ChecklistItemData = {
  id: 'meta',
  title: 'Page the security on-call',
  description: 'Use the primary rotation first.',
  state: 'open',
  assignee: { name: 'Leonard Riley', src: leonard },
  dueDate: 'Tomorrow',
  command: '/zoom start',
};

const emptyDraft = (): ChecklistItemData => ({
  id: 'draft',
  title: '',
  description: '',
  state: 'open',
});

export default function ChecklistItemLibrary() {
  const [item, setItem] = useState<ChecklistItemData>(withMeta);
  const [editing, setEditing] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState<ChecklistItemData | null>(
    null,
  );
  const [draft, setDraft] = useState<ChecklistItemData>(emptyDraft);

  const startEditing = () => {
    setEditSnapshot(item);
    setEditing(true);
  };

  const saveEditing = () => {
    if (!item.title.trim()) return;
    setEditing(false);
    setEditSnapshot(null);
  };

  const cancelEditing = () => {
    if (editSnapshot) setItem(editSnapshot);
    setEditing(false);
    setEditSnapshot(null);
  };

  return (
    <div className={styles['components__checklist-item-demo']}>
      <span className={styles['components__instance-label']}>
        Interactive (hover for actions)
      </span>
      <ChecklistItem
        item={item}
        editing={editing}
        onStateChange={(state) => setItem((prev) => ({ ...prev, state }))}
        onEdit={startEditing}
        onTitleChange={(title) => setItem((prev) => ({ ...prev, title }))}
        onDescriptionChange={(description) =>
          setItem((prev) => ({ ...prev, description }))
        }
        onSave={saveEditing}
        onCancel={cancelEditing}
        onAssign={() =>
          setItem((prev) => ({
            ...prev,
            assignee: prev.assignee
              ? undefined
              : { name: 'Leonard Riley', src: leonard },
          }))
        }
        onDueDate={() =>
          setItem((prev) => ({
            ...prev,
            dueDate: prev.dueDate ? undefined : 'Tomorrow',
          }))
        }
        onDuplicate={() => undefined}
        onDelete={() =>
          setItem((prev) => ({ ...prev, title: `${prev.title} (deleted)` }))
        }
      />

      <span className={styles['components__instance-label']}>Closed</span>
      <ChecklistItem
        item={{
          id: 'closed',
          title: 'Declare the incident channel',
          state: 'closed',
          checkedBy: { name: 'Leonard Riley', src: leonard },
        }}
      />

      <span className={styles['components__instance-label']}>Skipped</span>
      <ChecklistItem
        item={{
          id: 'skipped',
          title: 'Optional follow-up email',
          state: 'skipped',
        }}
      />

      <span className={styles['components__instance-label']}>
        Editing (add a task)
      </span>
      <ChecklistItem
        item={draft}
        editing
        focusOnEdit={false}
        showDragHandle={false}
        onTitleChange={(title) => setDraft((prev) => ({ ...prev, title }))}
        onDescriptionChange={(description) =>
          setDraft((prev) => ({ ...prev, description }))
        }
        onSave={() => setDraft(emptyDraft())}
        onCancel={() => setDraft(emptyDraft())}
      />
    </div>
  );
}
