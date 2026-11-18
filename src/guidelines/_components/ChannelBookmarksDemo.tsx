import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import {
  ChannelBookmarkModal,
  ChannelBookmarksBar,
  pickBookmarkFile,
  type ChannelBookmark,
  type ChannelBookmarkAddType,
  type ChannelBookmarksBarProps,
} from '@mattermost/compass-proto';
import { workspaceBookmarks } from '@/fixtures/workspaceBookmarks';

/**
 * Bookmarks added on purpose to what the sample data has (one per channel), so
 * the bar has enough to overflow and shows a file bookmark and a bookmark
 * without an emoji.
 */
const EXTRA_BOOKMARKS: ChannelBookmark[] = [
  {
    id: 'extra-handbook',
    emoji: '📎',
    label: 'Response handbook',
    labelText: 'Response handbook',
    type: 'file',
    href: 'https://example.com/handbook.pdf',
  },
  {
    id: 'extra-standup',
    emoji: '🗓️',
    label: 'Weekly standup notes',
    labelText: 'Weekly standup notes',
    href: 'https://example.com/standup',
  },
  {
    id: 'extra-oncall',
    label: 'On-call rotation',
    labelText: 'On-call rotation',
    href: 'https://example.com/oncall',
  },
  {
    id: 'extra-status',
    emoji: '🟢',
    label: 'Status page',
    labelText: 'Status page',
    href: 'https://example.com/status',
  },
];

/** The sample workspace's bookmarks, then the extras above. */
export const SAMPLE_BOOKMARKS: ChannelBookmark[] = [
  ...workspaceBookmarks,
  ...EXTRA_BOOKMARKS,
];

/** The bookmark that is a file, for the file icon. */
export const SAMPLE_FILE_BOOKMARK = EXTRA_BOOKMARKS[0]!;

type ModalState = {
  open: boolean;
  type: ChannelBookmarkAddType;
  editing?: ChannelBookmark;
  /** File picked from the OS dialog (file bookmarks), being "uploaded". */
  file?: File;
};

export interface ChannelBookmarksDemoProps extends Pick<
  ChannelBookmarksBarProps,
  'canManage'
> {
  initial?: ChannelBookmark[];
  /**
   * The bar is hidden when empty, and a standalone demo has no header menu to
   * add from. Shows add buttons in its place so the demo can be refilled.
   */
  addWhenEmpty?: boolean;
}

/** Lets a host open the add modal from outside the bar (e.g. a header menu). */
export interface ChannelBookmarksDemoHandle {
  openAdd: (type: ChannelBookmarkAddType) => void;
}

/** Stateful bar + modal for docs specimens: add (link / file), edit, delete, reorder. */
const ChannelBookmarksDemo = forwardRef<
  ChannelBookmarksDemoHandle,
  ChannelBookmarksDemoProps
>(function ChannelBookmarksDemo(
  { initial = SAMPLE_BOOKMARKS, canManage, addWhenEmpty = false },
  ref,
) {
  const [bookmarks, setBookmarks] = useState(initial);
  const [modal, setModal] = useState<ModalState>({ open: false, type: 'link' });
  // Simulated upload progress for the picked file (docs only: nothing is sent).
  const [progress, setProgress] = useState(100);

  // "Attach a file" opens the OS dialog first; the modal opens once a file is
  // chosen. Link bookmarks open the modal straight away.
  const startAdd = (type: ChannelBookmarkAddType) => {
    if (type === 'link') {
      setModal({ open: true, type });
      return;
    }
    void pickBookmarkFile().then((file) => {
      if (!file) return;
      setProgress(0);
      setModal({ open: true, type, file });
    });
  };
  useImperativeHandle(ref, () => ({ openAdd: startAdd }));

  useEffect(() => {
    if (!modal.open || !modal.file) return undefined;
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 8 + Math.round(Math.random() * 8));
        if (next >= 100) clearInterval(timer);
        return next;
      });
    }, 250);
    return () => clearInterval(timer);
  }, [modal.open, modal.file]);
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

  const editingName =
    modal.editing?.labelText ??
    (typeof modal.editing?.label === 'string'
      ? modal.editing.label
      : undefined);

  return (
    <>
      {addWhenEmpty && bookmarks.length === 0 && (
        <div style={{ display: 'flex', gap: 'var(--spacing-s)' }}>
          <Button
            emphasis="tertiary"
            size="small"
            onClick={() => startAdd('link')}
          >
            Add a link
          </Button>
          <Button
            emphasis="tertiary"
            size="small"
            onClick={() => startAdd('file')}
          >
            Attach a file
          </Button>
        </div>
      )}
      <ChannelBookmarksBar
        bookmarks={bookmarks}
        canManage={canManage}
        onAdd={startAdd}
        onReorder={setBookmarks}
        onEdit={(b) =>
          setModal({ open: true, type: b.type ?? 'link', editing: b })
        }
        onDelete={(b) => {
          releaseUrl(b.id);
          setBookmarks((all) => all.filter((x) => x.id !== b.id));
        }}
        onCopyLink={(b) =>
          // Clipboard access can be denied (permissions, insecure context).
          void navigator.clipboard?.writeText(b.href ?? '').catch(() => {})
        }
      />
      <ChannelBookmarkModal
        open={modal.open}
        type={modal.type}
        initialValues={
          modal.editing
            ? {
                title: editingName,
                url: modal.editing.href,
                fileName:
                  modal.editing.type === 'file' ? editingName : undefined,
                emoji: modal.editing.emoji,
              }
            : undefined
        }
        file={modal.file}
        uploadProgress={progress}
        onFileChange={(file) => {
          // A replacement restarts the simulated upload; removing cancels it.

          setProgress(0);
          setModal((m) => ({ ...m, file: file ?? undefined }));
        }}
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
});

export default ChannelBookmarksDemo;
