import { describe, expect, it } from 'vitest';
import { matchesAccept, validateFiles } from './validateFiles';

const file = (name: string, type: string, size = 10) =>
  new File([new Uint8Array(size)], name, { type });

describe('matchesAccept', () => {
  it('matches everything without accept', () => {
    expect(matchesAccept(file('a.bin', ''))).toBe(true);
    expect(matchesAccept(file('a.bin', ''), ' , ')).toBe(true);
  });

  it('matches extensions, wildcards and exact types case-insensitively', () => {
    expect(matchesAccept(file('A.PNG', ''), '.png')).toBe(true);
    expect(matchesAccept(file('a.jpg', 'image/jpeg'), 'image/*')).toBe(true);
    expect(
      matchesAccept(
        file('a.pdf', 'application/pdf'),
        'image/*, application/pdf',
      ),
    ).toBe(true);
    expect(matchesAccept(file('a.txt', 'text/plain'), 'image/*,.pdf')).toBe(
      false,
    );
  });
});

describe('validateFiles', () => {
  it('reports type, size and count rejections in order', () => {
    const files = [
      file('ok.png', 'image/png', 5),
      file('big.png', 'image/png', 500),
      file('doc.txt', 'text/plain', 5),
      file('ok2.png', 'image/png', 5),
      file('ok3.png', 'image/png', 5),
    ];
    const { accepted, rejected } = validateFiles(files, {
      accept: 'image/*',
      maxSize: 100,
      maxFiles: 2,
    });
    expect(accepted.map((f) => f.name)).toEqual(['ok.png', 'ok2.png']);
    expect(rejected.map((r) => [r.file.name, r.reason])).toEqual([
      ['big.png', 'file-size'],
      ['doc.txt', 'file-type'],
      ['ok3.png', 'too-many-files'],
    ]);
  });
});
