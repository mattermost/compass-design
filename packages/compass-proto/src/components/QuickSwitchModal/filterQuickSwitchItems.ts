import type { QuickSwitchItem, QuickSwitchKind } from './QuickSwitchModal';

// A leading `~`, `@` or `#` (as in `~bugs`) is a handle sigil, not part of the match.
const splitTerms = (query: string) =>
  query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/^[~@#]+/, ''))
    .filter(Boolean);

const SCOPE_BY_SIGIL: Record<string, QuickSwitchKind> = {
  '~': 'channel',
  '@': 'direct-message',
};

/** What an item is: its explicit `kind`, else inferred from an `@` handle; default channel. */
export function quickSwitchKind(item: QuickSwitchItem): QuickSwitchKind {
  if (item.kind) return item.kind;
  return item.secondaryLabel?.startsWith('@') ? 'direct-message' : 'channel';
}

/** `~` at the start of the query limits results to channels, `@` to direct messages. */
export function quickSwitchScope(query: string): QuickSwitchKind | undefined {
  return SCOPE_BY_SIGIL[query.trimStart().charAt(0)];
}

/** True when the query has at least one real term (a bare `~` or `@` doesn't). */
export const hasSearchTerms = (query: string) => splitTerms(query).length > 0;

/** Lower is better; `null` means the term doesn't match. */
function termScore(item: QuickSwitchItem, term: string): number | null {
  const name = item.name.toLowerCase();
  if (name.startsWith(term)) return 0;
  if (name.split(/[\s\-_:./@~]+/).some((word) => word.startsWith(term)))
    return 1;
  if (name.includes(term)) return 2;
  const secondary = (item.secondaryLabel ?? '')
    .toLowerCase()
    .replace(/^[~@#]/, '');
  if (secondary.startsWith(term)) return 3;
  // The leading emoji is part of the channel's display name, so searching for
  // it (or pasting the full name) still finds the channel.
  const rest = [secondary, item.leadingEmoji ?? '', ...(item.keywords ?? [])]
    .join(' ')
    .toLowerCase();
  return rest.includes(term) ? 4 : null;
}

function itemScore(item: QuickSwitchItem, terms: string[]): number | null {
  let total = 0;
  for (const term of terms) {
    const score = termScore(item, term);
    if (score === null) return null;
    total += score;
  }
  return total;
}

const isExactName = (item: QuickSwitchItem, terms: string[]) =>
  item.name.toLowerCase() === terms.join(' ');

/**
 * Default matcher and ranker. Every query term must match the name, secondary
 * label or keywords. Results are ordered by closeness (name prefix, then word
 * start, then substring, then secondary label / keywords); ties keep the
 * original order. A leading `~` limits results to channels and `@` to direct
 * messages (see `quickSwitchScope`). An empty query returns `items` unchanged.
 */
export function filterQuickSwitchItems(
  items: QuickSwitchItem[],
  query: string,
): QuickSwitchItem[] {
  const terms = splitTerms(query);
  const scope = quickSwitchScope(query);
  const pool = scope
    ? items.filter((item) => quickSwitchKind(item) === scope)
    : items;
  if (terms.length === 0) return pool;
  return (
    pool
      .map((item, index) => ({
        item,
        index,
        score: itemScore(item, terms),
        exact: isExactName(item, terms),
      }))
      .filter(
        (
          entry,
        ): entry is {
          item: QuickSwitchItem;
          index: number;
          score: number;
          exact: boolean;
        } => entry.score !== null,
      )
      // An exact name match always comes first, then closeness, then original order.
      .sort(
        (a, b) =>
          Number(b.exact) - Number(a.exact) ||
          a.score - b.score ||
          a.index - b.index,
      )
      .map((entry) => entry.item)
  );
}
