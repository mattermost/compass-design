const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Normalizes `#abc`, `abc`, `#aabbcc` to uppercase `#RRGGBB`; `null` when not a hex color. */
export function normalizeHex(input: string): string | null {
  const match = HEX_RE.exec(input.trim());
  if (!match) return null;
  let digits = match[1]!;
  if (digits.length === 3) {
    digits = digits
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${digits.toUpperCase()}`;
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of a hex color (0 = black, 1 = white); `null` when invalid. */
export function relativeLuminance(hex: string): number | null {
  const n = normalizeHex(hex);
  if (!n) return null;
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Picks the legible mark color for a swatch background by WCAG contrast:
 * `'light'` (white mark) or `'dark'` (dark mark).
 */
export function contrastingTone(hex: string): 'light' | 'dark' {
  const l = relativeLuminance(hex);
  if (l == null) return 'dark';
  // White vs. black cross over at luminance ≈ 0.179.
  return l > 0.179 ? 'dark' : 'light';
}
