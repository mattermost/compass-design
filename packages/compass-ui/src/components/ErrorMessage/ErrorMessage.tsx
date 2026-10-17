import type { HTMLAttributes, ReactNode } from 'react';
import FieldMessage from '@/components/FieldMessage/FieldMessage';

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional CSS class name. */
  className?: string;
  /** The error message. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  message: ReactNode;
}

/**
 * Error Message is the inline red error line under a form field. It is `FieldMessage` with
 * `tone="error"` — kept so existing imports (e.g. Agents plugin) stay valid.
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
