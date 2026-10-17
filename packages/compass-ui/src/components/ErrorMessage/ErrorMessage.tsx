import type { HTMLAttributes, ReactNode } from 'react';
import FieldMessage from '@/components/FieldMessage/FieldMessage';

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional CSS class name. */
  className?: string;
  /** The error message. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  message: ReactNode;
}

/**
 * Error Message is the inline red error line that appears below a form input when validation
 * fails. It pairs an alert glyph with a short, human-readable explanation so the user can
 * fix the field and move on.
 *
 * Prefer {@link FieldMessage} with an explicit `tone` when you need warning, info, or success.
 * This component remains a `tone="error"` wrapper for existing imports.
 */
export default function ErrorMessage({
  className = '',
  message,
  ...rest
}: ErrorMessageProps) {
  return (
    <FieldMessage
      {...rest}
      className={className}
      message={message}
      tone="error"
    />
  );
}
