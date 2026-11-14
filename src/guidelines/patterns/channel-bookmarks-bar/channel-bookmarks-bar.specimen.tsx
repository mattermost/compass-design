import { useState } from 'react';
import {
  ChannelBookmarkModal,
  ChannelBookmarksBar,
  type ChannelBookmark,
} from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/patterns.module.scss';

const SAMPLE: ChannelBookmark[] = [
  {
    id: 'wiki',
    label: 'Team wiki',
    labelText: 'Team wiki',
    href: 'https://example.com/wiki',
  },
  {
    id: 'roadmap',
    label: 'Q4 roadmap',
    labelText: 'Q4 roadmap',
    href: 'https://example.com/roadmap',
  },
  {
    id: 'design',
    label: 'Design system',
    labelText: 'Design system',
    href: 'https://example.com/design',
  },
  {
    id: 'handbook',
    label: 'Employee handbook',
    labelText: 'Employee handbook',
    type: 'file',
    href: 'https://example.com/handbook.pdf',
  },
  {
    id: 'standup',
    label: 'Weekly standup notes',
    labelText: 'Weekly standup notes',
    href: 'https://example.com/standup',
  },
  {
    id: 'oncall',
    label: 'On-call rotation',
    labelText: 'On-call rotation',
    href: 'https://example.com/oncall',
  },
];

export default function ChannelBookmarksBarLibrary() {
  const [bookmarks, setBookmarks] = useState(SAMPLE);
  const [modal, setModal] = useState<{
    open: boolean;
    editing?: ChannelBookmark;
  }>({ open: false });

  return (
    <div className={styles['patterns__channel-header-demo']}>
      <p className={styles['patterns__variant-label']}>
        Interactive — resize the window to see overflow
      </p>
      <ChannelBookmarksBar
        bookmarks={bookmarks}
        onAdd={() => setModal({ open: true })}
        onEdit={(b) => setModal({ open: true, editing: b })}
        onDelete={(b) =>
          setBookmarks((all) => all.filter((x) => x.id !== b.id))
        }
        onCopyLink={(b) => void navigator.clipboard?.writeText(b.href ?? '')}
      />
      <p className={styles['patterns__variant-label']}>Few bookmarks</p>
      <ChannelBookmarksBar bookmarks={SAMPLE.slice(0, 2)} />
      <p className={styles['patterns__variant-label']}>
        Read-only (no manage permission)
      </p>
      <ChannelBookmarksBar bookmarks={SAMPLE.slice(0, 3)} canManage={false} />
      <ChannelBookmarkModal
        open={modal.open}
        initialValues={
          modal.editing
            ? { title: modal.editing.labelText, url: modal.editing.href }
            : undefined
        }
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onSubmit={({ title, url }) => {
          const editing = modal.editing;
          setBookmarks((all) =>
            editing
              ? all.map((b) =>
                  b.id === editing.id
                    ? { ...b, label: title, labelText: title, href: url }
                    : b,
                )
              : [
                  ...all,
                  {
                    id: `bm-${Date.now()}`,
                    label: title,
                    labelText: title,
                    href: url,
                  },
                ],
          );
          setModal({ open: false });
        }}
      />
    </div>
  );
}
