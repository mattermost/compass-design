import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import PaperclipIcon from '@mattermost/compass-icons/components/paperclip';
import { Button } from '@mattermost/compass-ui/components/button';
import { EmojiButton } from '@mattermost/compass-ui/components/emoji-button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';
import { TextInput } from '@mattermost/compass-ui/components/text-input';
import { EmojiPopover } from '../EmojiPopover';
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

  useEffect(() => {
    if (open) {
      setUrl(initialValues?.url ?? '');
      setTitle(initialValues?.title ?? '');
      setEmoji(initialValues?.emoji);
      setFile(undefined);
      setError(null);
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
        <form className={styles['channel-bookmark-modal']} onSubmit={submit}>
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
              label={l.url}
              value={url}
              invalid={Boolean(error)}
              message={error ?? undefined}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
            />
          )}
          <div className={styles['channel-bookmark-modal__title-row']}>
            {emoji ? (
              <EmojiButton
                emoji={emoji}
                size="medium"
                aria-label={l.emoji}
                toggled={pickerOpen}
                onClick={() => setPickerOpen((o) => !o)}
              />
            ) : (
              <IconButton
                aria-label={l.emoji}
                icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
                toggled={pickerOpen}
                onClick={() => setPickerOpen((o) => !o)}
              />
            )}
            <div className={styles['channel-bookmark-modal__title-field']}>
              <TextInput
                label={l.name}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          {pickerOpen && (
            <div className={styles['channel-bookmark-modal__picker']}>
              <EmojiPopover
                onEmojiSelect={(next) => {
                  setEmoji(next);
                  setPickerOpen(false);
                }}
              />
              {emoji && (
                <Button
                  emphasis="tertiary"
                  size="small"
                  onClick={() => {
                    setEmoji(undefined);
                    setPickerOpen(false);
                  }}
                >
                  {l.removeEmoji}
                </Button>
              )}
            </div>
          )}
          {/* Enter submits from either field. */}
          <button type="submit" hidden />
        </form>
      </Modal>
    </ModalOverlay>
  );
}
