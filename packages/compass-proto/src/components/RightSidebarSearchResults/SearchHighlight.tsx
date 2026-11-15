import { Fragment, type HTMLAttributes } from 'react';
import { splitSearchHighlight } from './splitSearchHighlight';
import styles from './SearchHighlight.module.scss';

export interface SearchHighlightProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  /** Text to render. */
  text: string;
  /** Terms to highlight (case-insensitive). Nothing is highlighted when empty. */
  terms?: readonly string[];
  className?: string;
}

/** Renders `text` with each match of `terms` wrapped in a `<mark>`. */
export default function SearchHighlight({
  text,
  terms = [],
  className = '',
  ...rest
}: SearchHighlightProps) {
  return (
    <span {...rest} className={className || undefined}>
      {splitSearchHighlight(text, terms).map((part, index) =>
        part.match ? (
          <mark key={index} className={styles['search-highlight']}>
            {part.text}
          </mark>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </span>
  );
}
