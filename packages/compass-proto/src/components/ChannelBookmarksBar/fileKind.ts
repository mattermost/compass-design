import type { AttachmentCardFileType } from '@mattermost/compass-ui/components/attachment-card';

const BY_EXTENSION: Record<string, AttachmentCardFileType> = {
  txt: 'text',
  md: 'text',
  rtf: 'text',
  doc: 'word',
  docx: 'word',
  xls: 'excel',
  xlsx: 'excel',
  csv: 'excel',
  ppt: 'powerpoint',
  pptx: 'powerpoint',
  pdf: 'pdf',
  png: 'image-icon',
  jpg: 'image-icon',
  jpeg: 'image-icon',
  gif: 'image-icon',
  svg: 'image-icon',
  webp: 'image-icon',
  mov: 'video',
  mp4: 'video',
  webm: 'video',
  mkv: 'video',
  mp3: 'audio',
  wav: 'audio',
  m4a: 'audio',
  patch: 'patch',
  diff: 'patch',
  zip: 'zip',
  gz: 'zip',
  tar: 'zip',
  js: 'code',
  ts: 'code',
  tsx: 'code',
  json: 'code',
  html: 'code',
  css: 'code',
  py: 'code',
  go: 'code',
};

export function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** Icon kind for the attachment card, from the file name's extension. */
export function attachmentFileType(name: string): AttachmentCardFileType {
  return BY_EXTENSION[fileExtension(name)] ?? 'generic';
}

/** "3.2MB" style size, as the attachment card shows it. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)}MB`;
}

/** "MOV 3.2MB" meta line for a picked file. */
export function attachmentMeta(file: File): string {
  const ext = fileExtension(file.name).toUpperCase();
  return [ext, formatFileSize(file.size)].filter(Boolean).join(' ');
}
