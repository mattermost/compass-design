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

/** Shared demo affordances so Closed/Skipped rows still show the hover toolbar. */
function useDemoActions(initial: ChecklistItemData) {
  const [item, setItem] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [snapshot, setSnapshot] = useState<ChecklistItemData | null>(null);

  return {
    item,
    editing,
    onStateChange: (state: ChecklistItemData['state']) =>
      setItem((prev) => ({
        ...prev,
        state,
        checkedBy:
          state === 'closed'
            ? (prev.checkedBy ?? { name: 'Leonard Riley', src: leonard })
            : undefined,
      })),
    onEdit: () => {
      setSnapshot(item);
      setEditing(true);
    },
    onTitleChange: (title: string) => setItem((prev) => ({ ...prev, title })),
    onDescriptionChange: (description: string) =>
      setItem((prev) => ({ ...prev, description })),
    onSave: () => {
      if (!item.title.trim()) return;
      setEditing(false);
      setSnapshot(null);
    },
    onCancel: () => {
      if (snapshot) setItem(snapshot);
      setEditing(false);
      setSnapshot(null);
    },
    onAssign: () =>
      setItem((prev) => ({
        ...prev,
        assignee: prev.assignee
          ? undefined
          : { name: 'Leonard Riley', src: leonard },
      })),
    onDueDate: () =>
      setItem((prev) => ({
        ...prev,
        dueDate: prev.dueDate ? undefined : 'Tomorrow',
      })),
    onDuplicate: () => undefined,
    onDelete: () =>
      setItem((prev) => ({ ...prev, title: `${prev.title} (deleted)` })),
  };
}

export default function ChecklistItemLibrary() {
  const open = useDemoActions(withMeta);
  const closed = useDemoActions({
    id: 'closed',
    title: 'Declare the incident channel',
    state: 'closed',
    checkedBy: { name: 'Leonard Riley', src: leonard },
  });
  const skipped = useDemoActions({
    id: 'skipped',
    title: 'Optional follow-up email',
    state: 'skipped',
  });
  const [draft, setDraft] = useState<ChecklistItemData>(emptyDraft);

  return (
    <div className={styles['components__checklist-item-demo']}>
      <span className={styles['components__instance-label']}>
        Interactive (hover for actions)
      </span>
      <ChecklistItem {...open} />

      <span className={styles['components__instance-label']}>Closed</span>
      <ChecklistItem {...closed} />

      <span className={styles['components__instance-label']}>Skipped</span>
      <ChecklistItem {...skipped} />

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
