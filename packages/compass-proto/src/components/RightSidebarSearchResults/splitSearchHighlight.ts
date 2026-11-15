const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Splits `text` into alternating plain / matching segments for the given terms
 * (case-insensitive, longest term wins at a position). Blank terms are ignored.
 */
export function splitSearchHighlight(
  text: string,
  terms: readonly string[],
): { text: string; match: boolean }[] {
  const cleaned = Array.from(
    new Set(terms.map((term) => term.trim()).filter(Boolean)),
  ).sort((a, b) => b.length - a.length);
  if (cleaned.length === 0 || text === '') return [{ text, match: false }];
  const pattern = new RegExp(`(${cleaned.map(escapeRegExp).join('|')})`, 'gi');
  // With one capture group, split() puts every match at an odd index.
  return text
    .split(pattern)
    .map((part, index) => ({ text: part, match: index % 2 === 1 }))
    .filter((part) => part.text !== '');
}
