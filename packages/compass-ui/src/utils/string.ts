/**
 * Converts a string to kebab-case.
 * Used to map variant prop values (e.g. "do-not-disturb", "x-small")
 * to CSS modifier class name suffixes.
 */
export const toKebab = (s: string) => s.replace(/\s+/g, '-').toLowerCase();
