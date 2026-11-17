import { Fragment, type ReactNode } from 'react';
import styles from './FixtureMarkdown.module.scss';

/**
 * Renders the Markdown subset the sample posts use: headings, paragraphs (a
 * newline is a line break, as in Mattermost), bullet and numbered lists with
 * nesting, tables, quotes, fenced code, and inline bold, italic, code, links,
 * `@mentions` and `~channels`. It builds React elements, never HTML, so post
 * text cannot inject markup. Docs only; hosts use their own renderer.
 */
export default function FixtureMarkdown({
  text,
  inline: inlineOnly = false,
}: {
  text: string;
  /** Render one line of inline content only (no paragraph), for single-line slots such as the channel banner. */
  inline?: boolean;
}) {
  if (inlineOnly)
    return (
      <span className={styles['fixture-md--inline']}>
        {inline(text.replace(/\s*\n+\s*/g, ' '))}
      </span>
    );
  return <>{renderBlocks(text.split('\n'))}</>;
}

const HEADING = /^(#{1,6}) +(.*)$/;
const LIST = /^(\s*)([-*]|\d+\.) +(.*)$/;
const FENCE = /^```/;
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;
const TABLE_ROW = /^\s*\|.*\|\s*$/;
const TABLE_RULE = /^\s*\|?[\s:|-]+\|?\s*$/;

function renderBlocks(lines: string[]): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  const key = () => out.length;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim()) {
      i++;
    } else if (FENCE.test(line)) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !FENCE.test(lines[i]!)) code.push(lines[i++]!);
      i++;
      out.push(
        <pre key={key()} className={styles['fixture-md__pre']}>
          {code.join('\n')}
        </pre>,
      );
    } else if (RULE.test(line)) {
      out.push(<hr key={key()} className={styles['fixture-md__hr']} />);
      i++;
    } else if (HEADING.test(line)) {
      const [, hashes, content] = HEADING.exec(line)!;
      out.push(
        <p
          key={key()}
          className={`${styles['fixture-md__heading']} ${styles[`fixture-md__heading--${hashes!.length}`]}`}
        >
          {inline(content!)}
        </p>,
      );
      i++;
    } else if (TABLE_ROW.test(line) && TABLE_RULE.test(lines[i + 1] ?? '')) {
      const rows: string[] = [line];
      i += 2;
      while (i < lines.length && TABLE_ROW.test(lines[i]!))
        rows.push(lines[i++]!);
      out.push(table(rows, key()));
    } else if (/^>/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>/.test(lines[i]!))
        quote.push(lines[i++]!.replace(/^> ?/, ''));
      out.push(
        <blockquote key={key()} className={styles['fixture-md__quote']}>
          {renderBlocks(quote)}
        </blockquote>,
      );
    } else if (LIST.test(line)) {
      const items: ListItem[] = [];
      while (i < lines.length && LIST.test(lines[i]!)) {
        const [, indent, marker, content] = LIST.exec(lines[i]!)!;
        items.push({
          depth: Math.floor(indent!.length / 2),
          ordered: /\d/.test(marker!),
          text: content!,
        });
        i++;
      }
      out.push(list(items, 0, key()).node);
    } else {
      const para: string[] = [];
      while (
        i < lines.length &&
        lines[i]!.trim() &&
        !FENCE.test(lines[i]!) &&
        !HEADING.test(lines[i]!) &&
        !RULE.test(lines[i]!) &&
        !LIST.test(lines[i]!) &&
        !/^>/.test(lines[i]!)
      )
        para.push(lines[i++]!);
      out.push(
        <p key={key()} className={styles['fixture-md__p']}>
          {para.map((l, n) => (
            <Fragment key={n}>
              {n > 0 && <br />}
              {inline(l.replace(/ +$/, ''))}
            </Fragment>
          ))}
        </p>,
      );
    }
  }
  return out;
}

interface ListItem {
  depth: number;
  ordered: boolean;
  text: string;
}

/** Builds a nested list starting at `start`; returns the node and the index after it. */
function list(
  items: ListItem[],
  start: number,
  k: number,
): { node: ReactNode; next: number } {
  const depth = items[start]!.depth;
  const ordered = items[start]!.ordered;
  const children: ReactNode[] = [];
  let i = start;
  while (i < items.length && items[i]!.depth >= depth) {
    if (items[i]!.depth > depth) {
      const nested = list(items, i, i);
      children.push(<Fragment key={`n${i}`}>{nested.node}</Fragment>);
      i = nested.next;
      continue;
    }
    // An item and the list nested under it share one <li>.
    const li: ReactNode[] = [inline(items[i]!.text)];
    i++;
    if (i < items.length && items[i]!.depth > depth) {
      const nested = list(items, i, i);
      li.push(<Fragment key="nested">{nested.node}</Fragment>);
      i = nested.next;
    }
    children.push(
      <li key={i} className={styles['fixture-md__item']}>
        {li}
      </li>,
    );
  }
  const Tag = ordered ? 'ol' : 'ul';
  return {
    node: (
      <Tag
        key={k}
        className={`${styles['fixture-md__list']} ${ordered ? styles['fixture-md__list--ordered'] : ''}`}
      >
        {children}
      </Tag>
    ),
    next: i,
  };
}

function cells(row: string): string[] {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

function table(rows: string[], k: number): ReactNode {
  const [head, ...body] = rows;
  return (
    <table key={k} className={styles['fixture-md__table']}>
      <thead>
        <tr>
          {cells(head!).map((c, i) => (
            <th key={i} className={styles['fixture-md__th']}>
              {inline(c)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((r, i) => (
          <tr key={i}>
            {cells(r).map((c, n) => (
              <td key={n} className={styles['fixture-md__td']}>
                {inline(c)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const INLINE =
  /(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(`[^`]+`)|(\[[^\]]+\]\([^)\s]+\))|(https?:\/\/[^\s<)]+)|(@[a-z][a-z0-9._-]*)|(~[a-z][a-z0-9-]*)|(~~[^~]+~~)/g;

const unescape = (s: string) => s.replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, '$1');

/** Only http(s) and site-relative links become anchors. */
const safeHref = (href: string) =>
  /^(https?:\/\/|\/)/.test(href) ? href : undefined;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index!;
    if (at > last) out.push(unescape(text.slice(last, at)));
    const [token] = m;
    const k = at;
    if (m[1])
      out.push(
        <strong key={k} className={styles['fixture-md__strong']}>
          {inline(token.slice(2, -2))}
        </strong>,
      );
    else if (m[8]) out.push(<del key={k}>{inline(token.slice(2, -2))}</del>);
    else if (m[2]) out.push(<em key={k}>{inline(token.slice(1, -1))}</em>);
    else if (m[3])
      out.push(
        <code key={k} className={styles['fixture-md__code']}>
          {token.slice(1, -1)}
        </code>,
      );
    else if (m[4]) {
      const [, label, href] = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token)!;
      const safe = safeHref(href!);
      out.push(
        safe ? (
          <a
            key={k}
            className={styles['fixture-md__link']}
            href={safe}
            {...(safe.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {label}
          </a>
        ) : (
          label
        ),
      );
    } else if (m[5])
      out.push(
        <a
          key={k}
          className={styles['fixture-md__link']}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
        >
          {token}
        </a>,
      );
    else
      out.push(
        <span key={k} className={styles['fixture-md__mention']}>
          {token}
        </span>,
      );
    last = at + token.length;
  }
  if (last < text.length) out.push(unescape(text.slice(last)));
  return out;
}
