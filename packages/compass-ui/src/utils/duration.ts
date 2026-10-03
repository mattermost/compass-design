/**
 * Reads a duration token (e.g. `--duration-quick`) from the document root and
 * returns milliseconds, so JS timers that wait on a CSS transition follow the
 * token instead of a hard-coded copy. Falls back when the token is missing
 * (SSR, tests, hosts that did not load the stylesheet).
 */
export function readDurationMs(token: string, fallbackMs: number): number {
  if (typeof document === 'undefined') return fallbackMs;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const match = /^(\d*\.?\d+)(ms|s)$/.exec(raw);
  if (!match) return fallbackMs;
  const value = parseFloat(match[1]);
  return match[2] === 's' ? value * 1000 : value;
}
