import { useState } from 'react';
import { MessageInput } from '@mattermost/compass-proto';
import {
  SuggestionList,
  useSuggestionList,
  type SuggestionOption,
} from '@mattermost/compass-ui/components/suggestion-list';
import { Button } from '@mattermost/compass-ui/components/button';
import styles from '@/styles/library-demo/patterns.module.scss';

const SUGGESTIONS = [
  'Summarize this channel',
  'Draft a status update',
  'Find action items',
];

const MENTIONS: SuggestionOption[] = [
  { value: 'alex', label: 'alex', secondaryLabel: 'Alex Kim' },
  { value: 'alina', label: 'alina', secondaryLabel: 'Alina Rossi' },
  { value: 'alvaro', label: 'alvaro', secondaryLabel: 'Álvaro Gil' },
];

/** Live mention autocomplete: `useSuggestionList` wires the keys and combobox ARIA. */
function MentionSuggestionsDemo() {
  const [text, setText] = useState('');
  const query = /(?:^|\s)@(\w*)$/.exec(text)?.[1];
  const [dismissed, setDismissed] = useState(false);
  const options =
    query === undefined
      ? []
      : MENTIONS.filter((o) => o.value.startsWith(query.toLowerCase()));
  const open = query !== undefined && !dismissed && options.length > 0;
  const list = useSuggestionList({
    options,
    open,
    onSelect: (option) => {
      setText((t) => t.replace(/@\w*$/, `@${option.value} `));
      setDismissed(false);
    },
    onClose: () => setDismissed(true),
  });
  return (
    <MessageInput
      placeholder="Type @al to see suggestions…"
      value={text}
      onChange={(next) => {
        setText(next);
        setDismissed(false);
      }}
      onSend={() => setText('')}
      textareaProps={{ ...list.inputProps, onKeyDown: list.onKeyDown }}
      suggestions={
        open ? (
          <SuggestionList
            {...list.listProps}
            options={options}
            listboxLabel="Mentions"
          />
        ) : undefined
      }
    />
  );
}

export default function MessageInputLibrary() {
  return (
    <div className={styles['patterns__message-input-demo']}>
      <p className={styles['patterns__variant-label']}>Default</p>
      <MessageInput placeholder="Message #ux-design…" />
      <p className={styles['patterns__variant-label']}>
        Narrow (right sidebar)
      </p>
      <div className={styles['patterns__message-input-narrow']}>
        <MessageInput placeholder="Message #ux-design…" width="narrow" />
      </div>
      <p className={styles['patterns__variant-label']}>
        With priority indicator
      </p>
      <MessageInput placeholder="Message #ux-design…" showPriorityIndicator />
      <p className={styles['patterns__variant-label']}>With attachments</p>
      <MessageInput placeholder="Message #ux-design…" showAttachments />
      <p className={styles['patterns__variant-label']}>
        With priority + attachments
      </p>
      <MessageInput
        placeholder="Message #ux-design…"
        showPriorityIndicator
        showAttachments
      />
      <p className={styles['patterns__variant-label']}>With suggestions</p>
      <MessageInput
        placeholder="Message #ux-design…"
        suggestions={
          <div className={styles['patterns__message-input-suggestions']}>
            {SUGGESTIONS.map((suggestion) => (
              <Button key={suggestion} emphasis="tertiary" size="small">
                {suggestion}
              </Button>
            ))}
          </div>
        }
      />
      <p className={styles['patterns__variant-label']}>
        With suggestion list (type @al)
      </p>
      <MentionSuggestionsDemo />
    </div>
  );
}
