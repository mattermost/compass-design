import type { FieldMessageTone } from '@/components/FieldMessage/FieldMessage';

/**
 * True when a field message should render / contribute describedby / invalid chrome.
 * Treats `null`, `undefined`, `false`, and `''` as absent.
 */
export function hasFieldMessage(message: unknown): boolean {
  return !(message == null || message === false || message === '');
}

/** True when the field should show invalid chrome from props or an error message. */
export function isFieldInvalid(
  invalid: boolean,
  message: unknown,
  messageTone: FieldMessageTone | undefined,
): boolean {
  if (invalid) return true;
  if (!hasFieldMessage(message)) return false;
  return (messageTone ?? 'error') === 'error';
}

/** Merge host `aria-describedby` with message and counter ids (message before counter). */
export function mergeFieldDescribedBy(
  hostDescribedBy: string | undefined,
  messageId: string | undefined,
  counterId: string | undefined,
): string | undefined {
  const joined = [hostDescribedBy, messageId, counterId]
    .filter(Boolean)
    .join(' ');
  return joined || undefined;
}
