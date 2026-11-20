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

export default function ChecklistItemLibrary() {
  const [item, setItem] = useState<ChecklistItemData>(withMeta);
  const [draft, setDraft] = useState<ChecklistItemData>({
    id: 'draft',
    title: '',
    description: '',
    state: 'open',
  });

  return (
    <div className={styles['components__checklist-item-demo']}>
      <span className={styles['components__instance-label']}>
        Interactive (hover for actions)
      </span>
      <ChecklistItem
        item={item}
        onStateChange={(state) => setItem((prev) => ({ ...prev, state }))}
        onEdit={() =>
          setItem((prev) => ({
            ...prev,
            title: prev.title.endsWith(' (edited)')
              ? prev.title.replace(/ \(edited\)$/, '')
              : `${prev.title} (edited)`,
          }))
        }
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

      <span className={styles['components__instance-label']}>
        Actions always visible
      </span>
      <ChecklistItem
        actionsVisible
        item={{
          id: 'actions',
          title: 'Declare the incident channel',
          state: 'open',
        }}
        onEdit={() => undefined}
        onAssign={() => undefined}
        onDueDate={() => undefined}
        onDuplicate={() => undefined}
        onDelete={() => undefined}
        onStateChange={() => undefined}
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
