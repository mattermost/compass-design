import { useState } from 'react';
import {
  ChannelBookmarkModal,
  ChannelBookmarksBar,
  type ChannelBookmark,
  type ChannelBookmarkAddType,
  type ChannelBookmarksBarProps,
} from '@mattermost/compass-proto';

export const SAMPLE_BOOKMARKS: ChannelBookmark[] = [
  {
    id: 'wiki',
    emoji: '📚',
    label: 'Team wiki',
    labelText: 'Team wiki',
    href: 'https://example.com/wiki',
  },
  {
    id: 'roadmap',
    emoji: '🗺️',
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
    emoji: '📎',
    label: 'Employee handbook',
    labelText: 'Employee handbook',
    type: 'file',
    href: 'https://example.com/handbook.pdf',
  },
  {
    id: 'standup',
    emoji: '🗓️',
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
  {
    id: 'status',
    emoji: '🟢',
    label: 'Status page',
    labelText: 'Status page',
    href: 'https://example.com/status',
  },
];

type ModalState = {
  open: boolean;
  type: ChannelBookmarkAddType;
  editing?: ChannelBookmark;
};

export interface ChannelBookmarksDemoProps extends Pick<
  ChannelBookmarksBarProps,
  'canManage'
> {
  initial?: ChannelBookmark[];
}

/** Stateful bar + modal for docs specimens: add (link / file), edit, delete. */
export default function ChannelBookmarksDemo({
  initial = SAMPLE_BOOKMARKS,
  canManage,
}: ChannelBookmarksDemoProps) {
  const [bookmarks, setBookmarks] = useState(initial);
  const [modal, setModal] = useState<ModalState>({ open: false, type: 'link' });

  return (
    <>
      <ChannelBookmarksBar
        bookmarks={bookmarks}
        canManage={canManage}
        onAdd={(type) => setModal({ open: true, type })}
        onEdit={(b) =>
          setModal({ open: true, type: b.type ?? 'link', editing: b })
        }
        onDelete={(b) =>
          setBookmarks((all) => all.filter((x) => x.id !== b.id))
        }
        onCopyLink={(b) => void navigator.clipboard?.writeText(b.href ?? '')}
      />
      <ChannelBookmarkModal
        open={modal.open}
        type={modal.type}
        initialValues={
          modal.editing
            ? {
                title: modal.editing.labelText,
                url: modal.editing.href,
                fileName:
                  modal.editing.type === 'file'
                    ? modal.editing.labelText
                    : undefined,
                emoji: modal.editing.emoji,
              }
            : undefined
        }
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onSubmit={({ title, url, emoji, type }) => {
          const editing = modal.editing;
          const next = {
            label: title,
            labelText: title,
            emoji,
            type,
            href: url ?? editing?.href ?? 'https://example.com/file',
          };
          setBookmarks((all) =>
            editing
              ? all.map((b) => (b.id === editing.id ? { ...b, ...next } : b))
              : [...all, { id: `bm-${Date.now()}`, ...next }],
          );
          setModal((m) => ({ ...m, open: false }));
        }}
      />
    </>
  );
}
