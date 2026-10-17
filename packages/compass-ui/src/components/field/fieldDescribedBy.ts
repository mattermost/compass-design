import type { FieldMessageTone } from '@/components/FieldMessage/FieldMessage';

/** True when the field should show invalid chrome from props or an error message. */
export function isFieldInvalid(
  invalid: boolean,
  message: unknown,
  messageTone: FieldMessageTone | undefined,
): boolean {
  if (invalid) return true;
  if (message == null || message === false) return false;
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
