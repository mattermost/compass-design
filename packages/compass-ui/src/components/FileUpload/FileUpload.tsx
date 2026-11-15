import type {
  ChangeEvent,
  DragEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';
import { forwardRef, useCallback, useId, useRef, useState } from 'react';
import UploadOutlineIcon from '@mattermost/compass-icons/components/upload-outline';
import Button from '@/components/Button/Button';
import {
  hasFieldMessage,
  isFieldInvalid,
  mergeFieldDescribedBy,
} from '@/components/field/fieldDescribedBy';
import FieldMessage from '@/components/FieldMessage/FieldMessage';
import type { FieldMessageTone } from '@/components/FieldMessage/FieldMessage';
import Icon from '@/components/Icon/Icon';
import Spinner from '@/components/Spinner/Spinner';
import { mergeClassNames } from '@/utils/props';
import { toKebab } from '@/utils/string';
import type { FileUploadRejection } from './validateFiles';
import { validateFiles } from './validateFiles';
import styles from './FileUpload.module.scss';

export type FileUploadVariant = 'drop-zone' | 'button';

export interface FileUploadProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onDrop' | 'title' | 'children'
> {
  /** Optional CSS class name. */
  className?: string;
  /**
   * `drop-zone` is a dashed target that takes dropped files and opens the picker
   * on click or Enter / Space; `button` is a picker button only. Default: `drop-zone`.
   */
  variant?: FileUploadVariant;
  /**
   * Accepted types, same syntax as `<input accept>` (`image/*,.pdf`). Also
   * applied to dropped files, which the native attribute does not filter.
   */
  accept?: string;
  /** Allow several files in one selection. Default: false. */
  multiple?: boolean;
  /** Largest file accepted, in bytes. Larger files are reported as rejected. */
  maxSize?: number;
  /** Most files accepted per selection (1 when not `multiple`). Extra files are reported as rejected. */
  maxFiles?: number;
  /** Disables the picker and drops. */
  disabled?: boolean;
  /**
   * Shows a spinner and ignores new selections while the host handles the files
   * (for example while it uploads). The component never uploads anything itself.
   */
  loading?: boolean;
  /** Shows invalid styling. Also implied by an `error` `message`. */
  invalid?: boolean;
  /**
   * Primary line of the drop zone. Default: "Drag and drop files here" (or "a file"
   * when not `multiple`). Ignored by the `button` variant.
   */
  label?: ReactNode;
  /** Visible text of the picker control. Default: "Browse files" ("Browse file" when not `multiple`). */
  browseLabel?: ReactNode;
  /** Replaces `label` while files are dragged over the drop zone. Default: "Drop to upload". */
  dragActiveLabel?: ReactNode;
  /** Hint under the label, for example accepted types and size limits. */
  description?: ReactNode;
  /**
   * Field message under the control. Accepts translated nodes. Defaults to the
   * error tone when set without `messageTone`.
   */
  message?: ReactNode;
  /** Visual tone for `message`. Default: `error` when `message` is set. */
  messageTone?: FieldMessageTone;
  /**
   * Called with the files that passed `accept`, `maxSize` and `maxFiles`, from
   * the picker or a drop. Not called when every file was rejected.
   */
  onFilesSelected?: (files: File[]) => void;
  /** Called with the files that failed validation and why, after `onFilesSelected` for the same selection. */
  onFilesRejected?: (rejections: FileUploadRejection[]) => void;
  /**
   * Extra attributes for the hidden file input (for example `name`, `required`,
   * `data-testid`). The component's own `type`, `accept`, `multiple`,
   * `disabled` and `onChange` take precedence.
   */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'accept' | 'multiple' | 'disabled' | 'onChange' | 'children'
  >;
}

function hasFiles(e: DragEvent): boolean {
  return Array.from(e.dataTransfer?.types ?? []).includes('Files');
}

/**
 * File Upload lets people choose files from their device for an import, an icon or logo, or
 * an attachment on a form. It comes as a dashed drop zone or a plain picker button, and it
 * works fully from the keyboard.
 */
const FileUpload = forwardRef<HTMLElement, FileUploadProps>(function FileUpload(
  {
    className,
    variant = 'drop-zone',
    accept,
    multiple = false,
    maxSize,
    maxFiles,
    disabled = false,
    loading = false,
    invalid = false,
    label,
    browseLabel,
    dragActiveLabel = 'Drop to upload',
    description,
    message,
    messageTone,
    onFilesSelected,
    onFilesRejected,
    inputProps,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  // dragenter / dragleave also fire for child elements; count to know when the drag truly left.
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const inactive = disabled || loading;
  const isButton = variant === 'button';
  const limit = multiple ? maxFiles : 1;

  const resolvedLabel =
    label ??
    (multiple ? 'Drag and drop files here' : 'Drag and drop a file here');
  const resolvedBrowse =
    browseLabel ?? (multiple ? 'Browse files' : 'Browse file');

  const handleFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      const { accepted, rejected } = validateFiles(files, {
        accept,
        maxSize,
        maxFiles: limit,
      });
      if (accepted.length > 0) onFilesSelected?.(accepted);
      if (rejected.length > 0) onFilesRejected?.(rejected);
    },
    [accept, maxSize, limit, onFilesRejected, onFilesSelected],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    // Reset so choosing the same file again still fires change.
    e.target.value = '';
    if (!inactive) handleFiles(files);
  };

  const resetDrag = () => {
    dragDepth.current = 0;
    setIsDragging(false);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    // The zone is the drop target: keep a parent drop overlay from reacting too.
    e.stopPropagation();
    dragDepth.current += 1;
    if (!inactive) setIsDragging(true);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(e)) return;
    // Required for the element to be a valid drop target.
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = inactive ? 'none' : 'copy';
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(e)) return;
    e.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };
  // Button variant takes no drops, but must not let the browser navigate to a dropped file.
  const rejectDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(e)) return;
    // Always stop the browser from navigating to a dropped file.
    e.preventDefault();
    e.stopPropagation();
    resetDrag();
    if (inactive) return;
    handleFiles(Array.from(e.dataTransfer?.files ?? []));
  };

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (isButton) return;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref, isButton],
  );

  const showInvalid = isFieldInvalid(invalid, message, messageTone);
  const showMessage = hasFieldMessage(message);
  const messageId = showMessage ? `${generatedId}-message` : undefined;
  const descriptionId =
    description != null ? `${generatedId}-description` : undefined;
  const browseId = `${generatedId}-browse`;
  const inputId = inputProps?.id ?? `${generatedId}-input`;
  const describedBy = mergeFieldDescribedBy(
    inputProps?.['aria-describedby'],
    [descriptionId, messageId].filter(Boolean).join(' ') || undefined,
    undefined,
  );

  const rootClass = mergeClassNames(
    styles['file-upload'],
    styles[`file-upload--variant-${toKebab(variant)}`],
    isDragging && styles['file-upload--dragging'],
    disabled && styles['file-upload--disabled'],
    loading && styles['file-upload--loading'],
    showInvalid && styles['file-upload--invalid'],
    className,
  );

  const input = (
    <input
      {...inputProps}
      ref={setInputRef}
      id={inputId}
      type="file"
      className={mergeClassNames(
        isButton
          ? styles['file-upload__input--detached']
          : styles['file-upload__input'],
        inputProps?.className,
      )}
      accept={accept}
      multiple={multiple}
      disabled={inactive}
      onChange={handleInputChange}
      aria-labelledby={isButton ? undefined : browseId}
      aria-describedby={isButton ? undefined : describedBy}
      aria-invalid={showInvalid && !isButton ? true : undefined}
      tabIndex={isButton ? -1 : inputProps?.tabIndex}
      aria-hidden={isButton ? true : undefined}
    />
  );

  return (
    <div
      {...rest}
      className={rootClass}
      aria-busy={loading || undefined}
      onDragEnter={isButton ? undefined : handleDragEnter}
      onDragOver={isButton ? rejectDrag : handleDragOver}
      onDragLeave={isButton ? undefined : handleDragLeave}
      onDrop={isButton ? rejectDrag : handleDrop}
    >
      {input}
      {isButton ? (
        <>
          <Button
            ref={ref as Ref<HTMLButtonElement>}
            type="button"
            emphasis="secondary"
            leadingIcon={<Icon glyph={<UploadOutlineIcon />} />}
            loading={loading}
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={showInvalid ? true : undefined}
            onClick={() => inputRef.current?.click()}
          >
            {resolvedBrowse}
          </Button>
          {description != null && (
            <span
              id={descriptionId}
              className={styles['file-upload__description']}
            >
              {description}
            </span>
          )}
        </>
      ) : (
        <label className={styles['file-upload__zone']} htmlFor={inputId}>
          <span className={styles['file-upload__icon']} aria-hidden="true">
            {loading ? (
              <Spinner size="24" aria-label="" />
            ) : (
              <Icon glyph={<UploadOutlineIcon />} size="24" />
            )}
          </span>
          <span className={styles['file-upload__label']}>
            {isDragging ? dragActiveLabel : resolvedLabel}
          </span>
          <span id={browseId} className={styles['file-upload__browse']}>
            {resolvedBrowse}
          </span>
          {description != null && (
            <span
              id={descriptionId}
              className={styles['file-upload__description']}
            >
              {description}
            </span>
          )}
        </label>
      )}
      {showMessage && (
        <FieldMessage
          id={messageId}
          message={message}
          tone={messageTone ?? 'error'}
        />
      )}
    </div>
  );
});

export default FileUpload;
