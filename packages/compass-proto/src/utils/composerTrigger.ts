/** Characters that open the composer autocomplete. */
export type ComposerTrigger = '@' | '~' | ':' | '/';

export const COMPOSER_TRIGGERS: readonly ComposerTrigger[] = [
  '@',
  '~',
  ':',
  '/',
];

export interface ComposerTriggerMatch {
  trigger: ComposerTrigger;
  /** Index of the trigger character in the text. */
  start: number;
  /** Text between the trigger and the caret (no whitespace). */
  query: string;
}

export interface FindComposerTriggerOptions {
  /** Triggers to look for. Default: all four. */
  triggers?: readonly ComposerTrigger[];
  /** Fewest query characters before a trigger opens. Default: `:` needs 2 (so ":)" stays text), others 0. */
  minQueryLength?: Partial<Record<ComposerTrigger, number>>;
}

const DEFAULT_MIN: Record<ComposerTrigger, number> = {
  '@': 0,
  '~': 0,
  ':': 2,
  '/': 0,
};

/**
 * Finds the trigger the caret is typing in: the nearest trigger character
 * before `caret` with no whitespace between it and the caret. `@`, `~` and `:`
 * must start the text or follow whitespace (so emails and URLs don't open a
 * list); `/` only opens at the very start of the text, where a slash command
 * goes. Returns `null` when the caret isn't in a trigger.
 */
export function findComposerTrigger(
  text: string,
  caret: number,
  {
    triggers = COMPOSER_TRIGGERS,
    minQueryLength,
  }: FindComposerTriggerOptions = {},
): ComposerTriggerMatch | null {
  if (caret < 0 || caret > text.length) return null;
  for (let i = caret - 1; i >= 0; i--) {
    const ch = text[i];
    if (/\s/.test(ch)) return null;
    if (!(COMPOSER_TRIGGERS as readonly string[]).includes(ch)) continue;
    const trigger = ch as ComposerTrigger;
    const startsWord = i === 0 || /\s/.test(text[i - 1]);
    const allowed =
      triggers.includes(trigger) &&
      (trigger === '/' ? i === 0 : startsWord) &&
      caret - i - 1 >= (minQueryLength?.[trigger] ?? DEFAULT_MIN[trigger]);
    // A `:` inside a query (`@a:b`) belongs to the outer word, so keep looking.
    if (allowed) return { trigger, start: i, query: text.slice(i + 1, caret) };
  }
  return null;
}

/**
 * Replaces the typed trigger and query (`start` to `caret`) with `insertText`.
 * Adds a trailing space, unless `insertText` already ends in whitespace or a
 * space or tab follows the caret (that one is reused, never doubled). The caret
 * ends after the space, so it is no longer inside the trigger. Returns the new
 * text and where the caret goes.
 */
export function applyComposerSuggestion(
  text: string,
  match: ComposerTriggerMatch,
  caret: number,
  insertText: string,
): { text: string; caret: number } {
  const after = text.slice(caret);
  const endsInSpace = /\s$/.test(insertText);
  // Only a space or tab counts: a newline after the caret still gets a space
  // before it, so the caret stays on its line and leaves the word.
  const gapFollows = /^[ \t]/.test(after);
  let inserted = insertText;
  let rest = after;
  let stepOver = 0;
  if (endsInSpace) {
    // The insert supplies the space; don't double one that is already there.
    if (gapFollows) rest = after.slice(1);
  } else if (gapFollows) {
    // Keep the existing space and put the caret after it.
    stepOver = 1;
  } else {
    inserted += ' ';
  }
  return {
    text: text.slice(0, match.start) + inserted + rest,
    caret: match.start + inserted.length + stepOver,
  };
}
