import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  useAnchoredPopupPortal,
  type AnchoredPopupAnchor,
} from '@mattermost/compass-ui/hooks/use-anchored-popup-portal';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
import {
  SuggestionList,
  useSuggestionList,
  type SuggestionOption,
  type SuggestionSection,
} from '@mattermost/compass-ui/components/suggestion-list';
import MessageInput, {
  type MessageInputProps,
} from '../MessageInput/MessageInput';
import { getTextareaCharRect } from '../../utils/textareaCharRect';
import {
  applyComposerSuggestion,
  findComposerTrigger,
  type ComposerTrigger,
  type ComposerTriggerMatch,
} from '../../utils/composerTrigger';

/** What a source returns for a query: rows, optionally with a pending search. */
export type ComposerSuggestionResult =
  | SuggestionSection[]
  | {
      sections: SuggestionSection[];
      /** A remote search is pending; the list shows its loading row. */
      loading?: boolean;
    };

/** Rows for what has been typed after the trigger. Must be pure: it runs while rendering. */
export type ComposerSuggestionSource = (
  query: string,
) => ComposerSuggestionResult;

export interface MessageInputWithSuggestionsProps extends Omit<
  MessageInputProps,
  'suggestions'
> {
  /**
   * Which triggers are on, and what each one suggests: `@` people, `~`
   * channels, `:` emoji, `/` slash commands (at the start of the text). A
   * trigger with no source stays plain text.
   */
  sources: Partial<Record<ComposerTrigger, ComposerSuggestionSource>>;
  /**
   * Text that replaces the trigger and query for a chosen row. Default:
   * `@value`, `~value`, `:value:` and `/value`, plus a trailing space.
   */
  getInsertText?: (
    trigger: ComposerTrigger,
    option: SuggestionOption,
  ) => string;
  /** Called after a row is inserted. */
  onSuggestionSelect?: (
    trigger: ComposerTrigger,
    option: SuggestionOption,
  ) => void;
  /** Accessible name of the list. Default: "Suggestions". */
  suggestionsLabel?: string;
  /** Shown when a trigger has no matches. `null` closes the list instead. */
  emptyLabel?: ReactNode;
  /** Shown while a source reports `loading`. */
  loadingLabel?: ReactNode;
}

const DEFAULT_INSERT: Record<ComposerTrigger, (value: string) => string> = {
  '@': (v) => `@${v}`,
  '~': (v) => `~${v}`,
  ':': (v) => `:${v}:`,
  '/': (v) => `/${v}`,
};

const popupWidth = () => Math.min(480, window.innerWidth - 16);

function toResult(result: ComposerSuggestionResult) {
  return Array.isArray(result)
    ? { sections: result, loading: false }
    : { sections: result.sections, loading: result.loading ?? false };
}

interface PopupProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  boxRef: RefObject<HTMLDivElement | null>;
  match: ComposerTriggerMatch;
  surfaceRef: MutableRefObject<HTMLDivElement | null>;
  children: ReactNode;
}

/**
 * Portals the list to the body, always above the input box and placed at the
 * trigger character. Mounted per anchor (see `key` below) because the portal
 * hook reads the anchor when it opens, on resize and on scroll, not when the
 * host re-renders.
 */
function SuggestionsPopup({
  textareaRef,
  boxRef,
  match,
  surfaceRef,
  children,
}: PopupProps) {
  const matchStart = useRef(match.start);
  matchStart.current = match.start;
  const anchorRef = useRef<AnchoredPopupAnchor>({
    getBoundingClientRect: () => {
      const textarea = textareaRef.current;
      const box = boxRef.current?.getBoundingClientRect();
      if (!textarea || !box) return new DOMRect();
      const char = getTextareaCharRect(textarea, matchStart.current);
      const left = Math.max(
        box.left + 4,
        Math.min(char.left, window.innerWidth - popupWidth() - 8),
      );
      return new DOMRect(left, box.top, 0, box.height);
    },
  });
  const { style, portalRef, renderPortal } = useAnchoredPopupPortal(
    anchorRef,
    true,
    {
      preferredHeight: 320,
      side: 'above',
      gap: -4,
      matchWidth: false,
      zIndex: 'var(--z-popover)',
    },
  );
  return renderPortal(
    <div
      ref={(node) => {
        portalRef.current = node;
        surfaceRef.current = node;
      }}
      style={{ ...style, width: popupWidth() }}
    >
      {children}
    </div>,
  );
}

/**
 * A `MessageInput` with composer autocomplete: typing `@`, `~`, `:` or `/` (at
 * the start of the text) opens a `SuggestionList` above the input at the
 * trigger character, filtered by what follows it. Arrow keys move, Enter or Tab
 * insert the row at the caret, Escape closes until the trigger is typed again.
 * Enter that accepts a row does not send the draft. Nothing opens during IME
 * composition or while text is selected.
 *
 * The host supplies the rows per trigger through `sources`. Works controlled
 * (`value` / `onChange`) or uncontrolled.
 */
export default function MessageInputWithSuggestions({
  sources,
  getInsertText,
  onSuggestionSelect,
  suggestionsLabel,
  emptyLabel,
  loadingLabel,
  value,
  onChange,
  onSend,
  inputRef,
  textareaProps,
  ...rest
}: MessageInputWithSuggestionsProps) {
  const isControlled = value !== undefined;
  const [internalText, setInternalText] = useState('');
  const text = isControlled ? value : internalText;
  const setText = (next: string) => {
    if (!isControlled) setInternalText(next);
    onChange?.(next);
  };

  const ownRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? ownRef;
  const boxRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);

  const [caret, setCaret] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);
  const [dismissed, setDismissed] = useState<{
    trigger: ComposerTrigger;
    start: number;
  } | null>(null);
  const pendingCaret = useRef<number | null>(null);

  const readCaret = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    // A range selection is not typing a trigger.
    setCaret(el.selectionStart === el.selectionEnd ? el.selectionStart : null);
  }, [textareaRef]);

  // After the text changes (typing, or inserting a row), place the caret where
  // an insertion asked for, then read it back.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (el && pendingCaret.current !== null) {
      el.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
    readCaret();
  }, [text, textareaRef, readCaret]);

  const triggers = useMemo(
    () => Object.keys(sources) as ComposerTrigger[],
    [sources],
  );
  const match = useMemo(
    () =>
      caret === null || composing
        ? null
        : findComposerTrigger(text, caret, { triggers }),
    [text, caret, composing, triggers],
  );

  useEffect(() => {
    if (!match && dismissed) setDismissed(null);
  }, [match, dismissed]);

  const result = useMemo(() => {
    const source = match ? sources[match.trigger] : undefined;
    return match && source ? toResult(source(match.query)) : null;
  }, [match, sources]);

  const hasRows =
    result?.sections.some((section) => section.options.length > 0) ?? false;
  const open =
    match !== null &&
    result !== null &&
    !(
      dismissed &&
      dismissed.trigger === match.trigger &&
      dismissed.start === match.start
    ) &&
    (hasRows || result.loading || emptyLabel !== null);

  const closeList = useCallback(() => {
    if (match) setDismissed({ trigger: match.trigger, start: match.start });
  }, [match]);

  const select = (option: SuggestionOption) => {
    const el = textareaRef.current;
    if (!match || !el) return;
    const insert =
      getInsertText?.(match.trigger, option) ??
      DEFAULT_INSERT[match.trigger](option.value);
    const next = applyComposerSuggestion(
      text,
      match,
      el.selectionStart,
      insert,
    );
    pendingCaret.current = next.caret;
    setText(next.text);
    onSuggestionSelect?.(match.trigger, option);
  };

  const list = useSuggestionList({
    sections: result?.sections,
    open,
    showStatus: !hasRows,
    onSelect: select,
    onClose: closeList,
  });

  useOutsideClose(boxRef, open, closeList, surfaceRef);

  // The portal hook doesn't follow the trigger when the host re-renders, so
  // key the popup on where the anchor sits: wrapping onto another line or the
  // input growing remounts it, which measures again.
  const [anchorKey, setAnchorKey] = useState('');
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!open || !match || !textarea) return;
    const char = getTextareaCharRect(textarea, match.start);
    const box = boxRef.current?.getBoundingClientRect();
    const key = [
      match.start,
      Math.round(char.left),
      Math.round(char.top),
      Math.round(box?.top ?? 0),
      Math.round(box?.height ?? 0),
    ].join(':');
    setAnchorKey((current) => (current === key ? current : key));
  }, [open, match, text, textareaRef]);

  const hostProps = textareaProps ?? {};
  const mergedTextareaProps: NonNullable<MessageInputProps['textareaProps']> = {
    ...hostProps,
    ...list.inputProps,
    onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => {
      hostProps.onKeyDown?.(e);
      list.onKeyDown(e);
    },
    onSelect: (e) => {
      hostProps.onSelect?.(e);
      readCaret();
    },
    onKeyUp: (e) => {
      hostProps.onKeyUp?.(e);
      readCaret();
    },
    onClick: (e) => {
      hostProps.onClick?.(e);
      readCaret();
    },
    onInput: (e) => {
      hostProps.onInput?.(e);
      readCaret();
    },
    onCompositionStart: (e) => {
      hostProps.onCompositionStart?.(e);
      setComposing(true);
    },
    onCompositionEnd: (e) => {
      hostProps.onCompositionEnd?.(e);
      setComposing(false);
      readCaret();
    },
  };

  return (
    <div ref={boxRef}>
      <MessageInput
        {...rest}
        value={text}
        onChange={setText}
        inputRef={textareaRef}
        onSend={
          onSend
            ? (sent) => {
                onSend(sent);
                if (!isControlled) setInternalText('');
              }
            : undefined
        }
        textareaProps={mergedTextareaProps}
      />
      {open && match && result && (
        <SuggestionsPopup
          key={anchorKey}
          textareaRef={textareaRef}
          boxRef={boxRef}
          match={match}
          surfaceRef={surfaceRef}
        >
          <SuggestionList
            {...list.listProps}
            sections={result.sections}
            loading={result.loading}
            listboxLabel={suggestionsLabel}
            {...(emptyLabel !== undefined && { emptyLabel })}
            {...(loadingLabel !== undefined && { loadingLabel })}
          />
        </SuggestionsPopup>
      )}
    </div>
  );
}
