// A scheme is `name:` not followed by a port, so `localhost:8065` is a host and
// port, while `mailto:a@b.c` and `javascript:…` are schemes.
const SCHEME = /^[a-z][a-z0-9+.-]*:(?!\d+(?:[/?#]|$))/i;

/**
 * Normalizes a typed bookmark link to an absolute http(s) URL, or returns
 * `null` when it isn't acceptable. Single-label hosts are valid
 * (`http://intranet/handbook`, `localhost:8065`), but a bare word with no
 * scheme (`nope`) is rejected as a likely typo.
 */
export function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const hasScheme = SCHEME.test(value);
  try {
    const u = new URL(hasScheme ? value : `https://${value}`);
    if (!/^https?:$/.test(u.protocol)) return null;
    const singleLabel = !u.hostname.includes('.');
    if (singleLabel && !hasScheme && u.hostname !== 'localhost') return null;
    return u.toString();
  } catch {
    return null;
  }
}
