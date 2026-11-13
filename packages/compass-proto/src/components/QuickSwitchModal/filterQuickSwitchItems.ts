import type { QuickSwitchItem } from './QuickSwitchModal';

/** Default matcher: all query terms must appear in the name, breadcrumb or keywords. */
export function filterQuickSwitchItems(
  items: QuickSwitchItem[],
  query: string,
): QuickSwitchItem[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return items;
  return items.filter((item) => matchesTerms(item, terms));
}

function matchesTerms(item: QuickSwitchItem, terms: string[]): boolean {
  const haystack = [
    item.name,
    ...(item.breadcrumb ?? []),
    ...(item.keywords ?? []),
  ]
    .join(' ')
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}
