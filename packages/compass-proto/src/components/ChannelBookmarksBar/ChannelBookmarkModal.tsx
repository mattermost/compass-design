import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';
import { TextInput } from '@mattermost/compass-ui/components/text-input';
import styles from './ChannelBookmarkModal.module.scss';

export interface ChannelBookmarkModalValues {
  title: string;
  url: string;
}

export interface ChannelBookmarkModalLabels {
  createTitle?: string;
  editTitle?: string;
  url?: string;
  name?: string;
  cancel?: string;
  create?: string;
  save?: string;
  urlRequired?: string;
  urlInvalid?: string;
}

const DEFAULT_LABELS: Required<ChannelBookmarkModalLabels> = {
  createTitle: 'Add a bookmark',
  editTitle: 'Edit bookmark',
  url: 'Link',
  name: 'Title',
  cancel: 'Cancel',
  create: 'Add bookmark',
  save: 'Save',
  urlRequired: 'Enter a link.',
  urlInvalid: 'Enter a valid link, e.g. https://example.com',
};

export interface ChannelBookmarkModalProps {
  open: boolean;
  /** Prefills the form and switches the copy to "Edit bookmark". */
  initialValues?: Partial<ChannelBookmarkModalValues>;
  onSubmit: (values: ChannelBookmarkModalValues) => void;
  onClose: () => void;
  /** Portal node; pass a stage element to keep the scrim inside a frame (docs). */
  container?: HTMLElement | null;
  /** Lock body scroll while open. Default: true. */
  lockScroll?: boolean;
  labels?: ChannelBookmarkModalLabels;
}

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : `https://${value}`;
  try {
    const u = new URL(withScheme);
    return /^https?:$/.test(u.protocol) && u.hostname.includes('.')
      ? u.toString()
      : null;
  } catch {
    return null;
  }
}

/**
 * Create / edit modal for a channel link bookmark: a link and an optional title
 * (defaults to the link's host). The host owns open state and persistence.
 */
export default function ChannelBookmarkModal({
  open,
  initialValues,
  onSubmit,
  onClose,
  container,
  lockScroll,
  labels,
}: ChannelBookmarkModalProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const editing = Boolean(initialValues?.url);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl(initialValues?.url ?? '');
      setTitle(initialValues?.title ?? '');
      setError(null);
    }
    // Reset only when the modal (re)opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) return setError(l.urlRequired);
    const normalized = normalizeUrl(url);
    if (!normalized) return setError(l.urlInvalid);
    onSubmit({
      url: normalized,
      title: title.trim() || new URL(normalized).hostname.replace(/^www\./, ''),
    });
  };

  return (
    <ModalOverlay
      open={open}
      onClose={onClose}
      container={container}
      lockScroll={lockScroll}
    >
      <Modal
        open={open}
        title={editing ? l.editTitle : l.createTitle}
        onClose={onClose}
        initialFocusRef={urlRef}
        footer={
          <>
            <Button emphasis="tertiary" onClick={onClose}>
              {l.cancel}
            </Button>
            <Button emphasis="primary" onClick={() => submit()}>
              {editing ? l.save : l.create}
            </Button>
          </>
        }
      >
        <form className={styles['channel-bookmark-modal']} onSubmit={submit}>
          <TextInput
            ref={urlRef}
            label={l.url}
            value={url}
            invalid={Boolean(error)}
            message={error ?? undefined}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
          />
          <TextInput
            label={l.name}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* Enter submits from either field. */}
          <button type="submit" hidden />
        </form>
      </Modal>
    </ModalOverlay>
  );
}
