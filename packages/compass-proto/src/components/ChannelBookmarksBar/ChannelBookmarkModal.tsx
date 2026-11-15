import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from 'react';
import { createPortal } from 'react-dom';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import PaperclipIcon from '@mattermost/compass-icons/components/paperclip';
import { Button } from '@mattermost/compass-ui/components/button';
import { EmojiButton } from '@mattermost/compass-ui/components/emoji-button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
import { TextInput } from '@mattermost/compass-ui/components/text-input';
import { EmojiPopover } from '../EmojiPopover';
import { WithTooltip } from '../WithTooltip';
import type { ChannelBookmarkAddType } from './ChannelBookmarksBar';
import styles from './ChannelBookmarkModal.module.scss';

export interface ChannelBookmarkModalValues {
  type: ChannelBookmarkAddType;
  title: string;
  /** Normalized link (link bookmarks). */
  url?: string;
  /** Chosen file (file bookmarks). Undefined when editing keeps the existing file. */
  file?: File;
  fileName?: string;
  emoji?: string;
}

export interface ChannelBookmarkModalLabels {
  addLinkTitle?: string;
  attachFileTitle?: string;
  editTitle?: string;
  url?: string;
  name?: string;
  chooseFile?: string;
  replaceFile?: string;
  noFile?: string;
  emoji?: string;
  removeEmoji?: string;
  cancel?: string;
  create?: string;
  save?: string;
  urlRequired?: string;
  urlInvalid?: string;
  fileRequired?: string;
}

const DEFAULT_LABELS: Required<ChannelBookmarkModalLabels> = {
  addLinkTitle: 'Add a link',
  attachFileTitle: 'Attach a file',
  editTitle: 'Edit bookmark',
  url: 'Link',
  name: 'Title',
  chooseFile: 'Choose file',
  replaceFile: 'Replace file',
  noFile: 'No file selected',
  emoji: 'Choose an emoji',
  removeEmoji: 'Remove emoji',
  cancel: 'Cancel',
  create: 'Add bookmark',
  save: 'Save',
  urlRequired: 'Enter a link.',
  urlInvalid: 'Enter a valid link, e.g. https://example.com',
  fileRequired: 'Choose a file to attach.',
};

export interface ChannelBookmarkModalProps {
  open: boolean;
  /** What is being added. The form fields depend on it. Default: `link`. */
  type?: ChannelBookmarkAddType;
  /** When set, the modal edits an existing bookmark instead of creating one. */
  initialValues?: Partial<
    Pick<ChannelBookmarkModalValues, 'title' | 'url' | 'fileName' | 'emoji'>
  >;
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
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  try {
    const u = new URL(hasScheme ? value : `https://${value}`);
    if (!/^https?:$/.test(u.protocol)) return null;
    // Single-label hosts (`http://intranet/…`, `localhost:8065`) are valid, but
    // a bare word with no scheme (`nope`) is almost certainly a typo.
    const singleLabel = !u.hostname.includes('.');
    if (singleLabel && !hasScheme && u.hostname !== 'localhost') return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Create / edit modal for a channel bookmark. The fields follow `type`: a link
 * and title for links, a file picker and title for attachments; both take an
 * optional emoji. The host owns open state and persistence.
 */
export default function ChannelBookmarkModal({
  open,
  type = 'link',
  initialValues,
  onSubmit,
  onClose,
  container,
  lockScroll,
  labels,
}: ChannelBookmarkModalProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const editing = initialValues !== undefined;
  const isFile = type === 'file';
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiAnchorRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);
  const [pickerStyle, setPickerStyle] = useState<CSSProperties>({
    visibility: 'hidden',
  });

  // The picker is portaled so it never changes the modal's height; place it
  // under the emoji button (flipping above when there's no room).
  useLayoutEffect(() => {
    if (!pickerOpen) return undefined;
    const place = () => {
      const anchor = emojiAnchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const height = pickerRef.current?.offsetHeight ?? 0;
      const width = pickerRef.current?.offsetWidth ?? 0;
      const margin = 8;
      const below = rect.bottom + margin;
      const fitsBelow = below + height <= window.innerHeight - margin;
      const top = fitsBelow
        ? below
        : Math.max(margin, rect.top - margin - height);
      const left = Math.min(
        Math.max(margin, rect.left),
        Math.max(margin, window.innerWidth - width - margin),
      );
      setPickerStyle({ top, left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [pickerOpen]);

  // The picker lives outside the dialog's DOM (portaled), so move focus into it
  // on open and hand it back to the emoji button on close.
  useEffect(() => {
    if (!pickerOpen) return undefined;
    const anchor = emojiAnchorRef.current;
    const frame = requestAnimationFrame(() => {
      pickerRef.current?.querySelector<HTMLElement>('input')?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      // Only hand focus back for keyboard / selection closes; an outside press
      // keeps whatever the user clicked.
      if (restoreFocusRef.current) {
        restoreFocusRef.current = false;
        anchor?.querySelector<HTMLElement>('button')?.focus();
      }
    };
  }, [pickerOpen]);

  useOutsideClose(
    emojiAnchorRef,
    pickerOpen,
    () => setPickerOpen(false),
    pickerRef,
  );

  useEffect(() => {
    if (open) {
      setUrl(initialValues?.url ?? '');
      setTitle(initialValues?.title ?? '');
      setEmoji(initialValues?.emoji);
      setFile(undefined);
      setError(null);
      setPickerOpen(false);
    } else {
      setPickerOpen(false);
    }
    // Reset only when the modal (re)opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const existingFileName = initialValues?.fileName;
  const fileName = file?.name ?? existingFileName;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (isFile) {
      if (!fileName) return setError(l.fileRequired);
      return onSubmit({
        type,
        file,
        fileName,
        emoji,
        title: title.trim() || fileName,
      });
    }
    if (!url.trim()) return setError(l.urlRequired);
    const normalized = normalizeUrl(url);
    if (!normalized) return setError(l.urlInvalid);
    onSubmit({
      type,
      url: normalized,
      emoji,
      title: title.trim() || new URL(normalized).hostname.replace(/^www\./, ''),
    });
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) {
      setFile(picked);
      setError(null);
    }
  };

  const heading = editing
    ? l.editTitle
    : isFile
      ? l.attachFileTitle
      : l.addLinkTitle;

  return (
    <ModalOverlay
      open={open}
      onClose={onClose}
      container={container}
      lockScroll={lockScroll}
    >
      <Modal
        open={open}
        title={heading}
        onClose={onClose}
        headerDivider={false}
        footerDivider={false}
        initialFocusRef={isFile ? undefined : firstFieldRef}
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
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Escape closes only the picker; the modal honors defaultPrevented */}
        <form
          className={styles['channel-bookmark-modal']}
          onSubmit={submit}
          onKeyDown={(e) => {
            // Escape closes just the open picker; the modal honors defaultPrevented.
            if (e.key === 'Escape' && pickerOpen) {
              e.preventDefault();
              restoreFocusRef.current = true;
              setPickerOpen(false);
            }
          }}
        >
          {isFile ? (
            <div className={styles['channel-bookmark-modal__file']}>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                data-testid="bookmark-file-input"
                onChange={onFileChange}
              />
              <Button
                emphasis="secondary"
                onClick={() => fileInputRef.current?.click()}
                leadingIcon={<Icon glyph={<PaperclipIcon />} />}
              >
                {fileName ? l.replaceFile : l.chooseFile}
              </Button>
              <span
                className={[
                  styles['channel-bookmark-modal__file-name'],
                  error && styles['channel-bookmark-modal__file-name--error'],
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {error ?? fileName ?? l.noFile}
              </span>
            </div>
          ) : (
            <TextInput
              ref={firstFieldRef}
              aria-label={l.url}
              placeholder={l.url}
              value={url}
              invalid={Boolean(error)}
              message={error ?? undefined}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
            />
          )}
          <TextInput
            aria-label={l.name}
            placeholder={l.name}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            leadingIcon={
              <span
                ref={emojiAnchorRef}
                className={styles['channel-bookmark-modal__emoji']}
              >
                <WithTooltip label={l.emoji}>
                  {emoji ? (
                    <EmojiButton
                      emoji={emoji}
                      size="small"
                      padding="compact"
                      className={styles['channel-bookmark-modal__emoji-button']}
                      aria-label={l.emoji}
                      toggled={pickerOpen}
                      onClick={() => setPickerOpen((o) => !o)}
                    />
                  ) : (
                    <IconButton
                      size="small"
                      padding="compact"
                      className={styles['channel-bookmark-modal__emoji-button']}
                      aria-label={l.emoji}
                      icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
                      toggled={pickerOpen}
                      onClick={() => setPickerOpen((o) => !o)}
                    />
                  )}
                </WithTooltip>
              </span>
            }
          />
          {emoji && (
            <div className={styles['channel-bookmark-modal__remove-emoji']}>
              <Button
                emphasis="link"
                size="x-small"
                onClick={() => setEmoji(undefined)}
              >
                {l.removeEmoji}
              </Button>
            </div>
          )}
          {open &&
            pickerOpen &&
            createPortal(
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Escape closes only the picker and Tab stays inside it
              <div
                ref={pickerRef}
                className={styles['channel-bookmark-modal__picker']}
                style={pickerStyle}
                role="dialog"
                aria-label={l.emoji}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    restoreFocusRef.current = true;
                    setPickerOpen(false);
                    return;
                  }
                  if (e.key !== 'Tab') return;
                  // Keep Tab inside the picker; the modal's own trap would
                  // otherwise pull focus back into the dialog.
                  e.nativeEvent.stopPropagation();
                  const items = Array.from(
                    pickerRef.current?.querySelectorAll<HTMLElement>(
                      'button, input, [tabindex]:not([tabindex="-1"])',
                    ) ?? [],
                  ).filter((el) => !el.hasAttribute('disabled'));
                  if (items.length === 0) return;
                  const first = items[0];
                  const last = items[items.length - 1];
                  if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                  } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                  }
                }}
              >
                <EmojiPopover
                  onEmojiSelect={(next) => {
                    setEmoji(next);
                    restoreFocusRef.current = true;
                    setPickerOpen(false);
                  }}
                />
              </div>,
              document.body,
            )}
          {/* Enter submits from either field. */}
          <button type="submit" hidden />
        </form>
      </Modal>
    </ModalOverlay>
  );
}
