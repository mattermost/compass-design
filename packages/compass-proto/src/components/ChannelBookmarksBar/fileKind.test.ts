import { describe, expect, it } from 'vitest';
import {
  attachmentFileType,
  attachmentMeta,
  fileExtension,
  formatFileSize,
} from './fileKind';

describe('fileKind', () => {
  it('maps extensions to card file types, defaulting to generic', () => {
    expect(attachmentFileType('clip.MOV')).toBe('video');
    expect(attachmentFileType('handbook.pdf')).toBe('pdf');
    expect(attachmentFileType('notes')).toBe('generic');
    expect(attachmentFileType('weird.xyz')).toBe('generic');
  });

  it('reads the extension, ignoring leading dots', () => {
    expect(fileExtension('a.tar.gz')).toBe('gz');
    expect(fileExtension('.env')).toBe('');
  });

  it('formats sizes', () => {
    expect(formatFileSize(512)).toBe('512B');
    expect(formatFileSize(15 * 1024)).toBe('15KB');
    expect(formatFileSize(3.2 * 1024 * 1024)).toBe('3.2MB');
    expect(formatFileSize(25 * 1024 * 1024)).toBe('25MB');
  });

  it('builds the meta line', () => {
    expect(attachmentMeta(new File(['x'.repeat(2048)], 'a.txt'))).toBe(
      'TXT 2KB',
    );
  });
});
