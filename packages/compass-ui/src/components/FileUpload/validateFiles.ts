export type FileUploadRejectionReason =
  | 'file-type'
  | 'file-size'
  | 'too-many-files';

export interface FileUploadRejection {
  file: File;
  reason: FileUploadRejectionReason;
}

export interface ValidateFilesOptions {
  /** Same syntax as the `accept` attribute of `<input type="file">`. */
  accept?: string;
  /** Maximum size of one file, in bytes. */
  maxSize?: number;
  /** Maximum number of files accepted from one selection. */
  maxFiles?: number;
}

/**
 * True when `file` matches an `accept` string (`.png`, `image/*`,
 * `application/pdf`, comma separated). Dropped files bypass the native `accept`
 * attribute, so the component applies it itself. An empty / missing `accept`
 * matches every file.
 */
export function matchesAccept(file: File, accept?: string): boolean {
  const tokens = (accept ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

/**
 * Splits a selection into accepted files and rejections, in selection order.
 * Type and size are checked per file; files beyond `maxFiles` are rejected with
 * `too-many-files`.
 */
export function validateFiles(
  files: readonly File[],
  { accept, maxSize, maxFiles }: ValidateFilesOptions,
): { accepted: File[]; rejected: FileUploadRejection[] } {
  const accepted: File[] = [];
  const rejected: FileUploadRejection[] = [];
  for (const file of files) {
    if (!matchesAccept(file, accept)) {
      rejected.push({ file, reason: 'file-type' });
    } else if (maxSize != null && file.size > maxSize) {
      rejected.push({ file, reason: 'file-size' });
    } else if (maxFiles != null && accepted.length >= maxFiles) {
      rejected.push({ file, reason: 'too-many-files' });
    } else {
      accepted.push(file);
    }
  }
  return { accepted, rejected };
}
