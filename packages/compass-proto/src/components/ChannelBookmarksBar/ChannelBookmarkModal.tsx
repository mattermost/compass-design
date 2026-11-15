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
import BookOutlineIcon from '@mattermost/compass-icons/components/book-outline';
import FileGenericOutlineIcon from '@mattermost/compass-icons/components/file-generic-outline';
import PaperclipIcon from '@mattermost/compass-icons/components/paperclip';
import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import { AttachmentCard } from '@mattermost/compass-ui/components/attachment-card';
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
import { attachmentFileType, attachmentMeta } from './fileKind';
import { normalizeUrl } from './normalizeUrl';
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
  editFile?: string;
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
  editFile: 'Edit',
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
  /**
   * Extra style on the scrim. Pair with `container` and `position: 'absolute'`
   * to stage the modal inside a frame (docs previews).
   */
  overlayStyle?: CSSProperties;
  /**
   * Initial focus, Tab trap and focus restore (see `Modal`). Turn off for
   * static docs previews so they don't steal focus. Default: true.
   */
  manageFocus?: boolean;
  /**
   * File bookmarks: the file the member picked from the operating system's
   * dialog before the modal opened (see `pickBookmarkFile`). Shown as an
   * attachment card.
   */
  file?: File;
  /**
   * Upload progress for `file`, 0–100. Below 100 the card shows the uploading
   * state and the submit button is disabled; undefined or 100 means uploaded.
   * The host owns the upload.
   */
  uploadProgress?: number;
  /**
   * The member replaced the file (card Edit button, which reopens the file
   * dialog) or removed it (the card's close button, `null`). The host should
   * restart or cancel the upload.
   */
  onFileChange?: (file: File | null) => void;
  labels?: ChannelBookmarkModalLabels;
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
  overlayStyle,
  manageFocus = true,
  file: fileProp,
  uploadProgress,
  onFileChange,
  labels,
}: ChannelBookmarkModalProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const editing = initialValues !== undefined;
  const isFile = type === 'file';
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>(fileProp);
  // The existing file of a bookmark being edited was removed from the card.
  const [existingRemoved, setExistingRemoved] = useState(false);
  // A typed title wins over the file name; until then it follows the file.
  const titleEdited = useRef(false);
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

  // Layout effect: reset before paint so a reopened modal never flashes the
  // previous file or fields for a frame.
  useLayoutEffect(() => {
    if (open) {
      setUrl(initialValues?.url ?? '');
      setTitle(initialValues?.title ?? fileProp?.name ?? '');
      titleEdited.current = Boolean(initialValues?.title);
      setExistingRemoved(false);
      setEmoji(initialValues?.emoji);
      setFile(fileProp);
      setError(null);
      setPickerOpen(false);
    } else {
      setPickerOpen(false);
    }
    // Reset only when the modal (re)opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const existingFileName = existingRemoved
    ? undefined
    : initialValues?.fileName;
  const fileName = file?.name ?? existingFileName;
  const uploading =
    isFile &&
    Boolean(file) &&
    uploadProgress !== undefined &&
    uploadProgress < 100;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (uploading) return;
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

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) {
      setFile(picked);
      setExistingRemoved(false);
      setError(null);
      if (!titleEdited.current) setTitle(picked.name);
      onFileChange?.(picked);
    }
    // Let the same file be chosen again after removing it.
    e.target.value = '';
  };

  const removeFile = () => {
    setFile(undefined);
    setExistingRemoved(true);
    if (!titleEdited.current) setTitle('');
    onFileChange?.(null);
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
      style={overlayStyle}
    >
      <Modal
        open={open}
        title={heading}
        onClose={onClose}
        headerDivider={false}
        footerDivider={false}
        manageFocus={manageFocus}
        initialFocusRef={isFile ? undefined : firstFieldRef}
        footer={
          <>
            <Button emphasis="tertiary" onClick={onClose}>
              {l.cancel}
            </Button>
            <Button
              emphasis="primary"
              disabled={uploading}
              onClick={() => submit()}
            >
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
                onChange={onFileInput}
              />
              {fileName ? (
                <div className={styles['channel-bookmark-modal__attachment']}>
                  <AttachmentCard
                    className={styles['channel-bookmark-modal__card']}
                    fileName={fileName}
                    fileType={attachmentFileType(fileName)}
                    fileMeta={file ? attachmentMeta(file) : undefined}
                    state={uploading ? 'uploading' : 'uploaded'}
                    progress={uploadProgress}
                    onRemove={removeFile}
                  />
                  <Button
                    emphasis="tertiary"
                    size="small"
                    leadingIcon={<Icon glyph={<PencilOutlineIcon />} />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {l.editFile}
                  </Button>
                </div>
              ) : (
                <div className={styles['channel-bookmark-modal__no-file']}>
                  <Button
                    emphasis="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    leadingIcon={<Icon glyph={<PaperclipIcon />} />}
                  >
                    {l.chooseFile}
                  </Button>
                  <span
                    className={[
                      styles['channel-bookmark-modal__file-name'],
                      error &&
                        styles['channel-bookmark-modal__file-name--error'],
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {error ?? l.noFile}
                  </span>
                </div>
              )}
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
            onChange={(e) => {
              titleEdited.current = true;
              setTitle(e.target.value);
            }}
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
                      icon={
                        <Icon
                          glyph={
                            isFile ? (
                              <FileGenericOutlineIcon />
                            ) : (
                              <BookOutlineIcon />
                            )
                          }
                        />
                      }
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
