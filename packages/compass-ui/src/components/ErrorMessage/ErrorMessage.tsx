import type { HTMLAttributes, ReactNode } from 'react';
import FieldMessage from '@/components/FieldMessage/FieldMessage';

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional CSS class name. */
  className?: string;
  /** The error message. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  message: ReactNode;
}

/**
 * Inline error line under a form field (`FieldMessage` with `tone="error"`).
 * Prefer `FieldMessage` when you need warning, info, or success; this export
 * stays for existing callers.
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
