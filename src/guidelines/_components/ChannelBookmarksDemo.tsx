import { useEffect, useRef, useState } from 'react';
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
  // Object URLs for attached files, by bookmark id. Revoked when a file is
  // replaced or its bookmark deleted, and on unmount.
  const objectUrls = useRef(new Map<string, string>());

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const releaseUrl = (id: string) => {
    const url = objectUrls.current.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      objectUrls.current.delete(id);
    }
  };

  return (
    <>
      <ChannelBookmarksBar
        bookmarks={bookmarks}
        canManage={canManage}
        onAdd={(type) => setModal({ open: true, type })}
        onEdit={(b) =>
          setModal({ open: true, type: b.type ?? 'link', editing: b })
        }
        onDelete={(b) => {
          releaseUrl(b.id);
          setBookmarks((all) => all.filter((x) => x.id !== b.id));
        }}
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
        onSubmit={({ title, url, file, emoji, type }) => {
          const editing = modal.editing;
          const id = editing?.id ?? `bm-${Date.now()}`;
          let href = url ?? editing?.href ?? '';
          if (file) {
            // A new or replacement file: point the bookmark at it.
            releaseUrl(id);
            href = URL.createObjectURL(file);
            objectUrls.current.set(id, href);
          }
          const next = { label: title, labelText: title, emoji, type, href };
          setBookmarks((all) =>
            editing
              ? all.map((b) => (b.id === id ? { ...b, ...next } : b))
              : [...all, { id, ...next }],
          );
          setModal((m) => ({ ...m, open: false }));
        }}
      />
    </>
  );
}
