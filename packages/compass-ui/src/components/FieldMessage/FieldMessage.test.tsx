import { describe, expect, it } from 'vitest';
import { getByRole, queryAllByRole, render } from '@/test-utils/render';
import FieldMessage from './FieldMessage';

describe('FieldMessage', () => {
  it('error and warning use role=alert', () => {
    const { rerender } = render(
      <FieldMessage message="Required" tone="error" />,
    );
    expect(getByRole('alert').textContent).toBe('Required');

    rerender(<FieldMessage message="Careful" tone="warning" />);
    expect(getByRole('alert').textContent).toBe('Careful');
  });

  it('info and success do not use role=alert', () => {
    const { rerender } = render(<FieldMessage message="Hint" tone="info" />);
    expect(queryAllByRole('alert')).toHaveLength(0);

    rerender(<FieldMessage message="Done" tone="success" />);
    expect(queryAllByRole('alert')).toHaveLength(0);
  });

  it('info has no icon; error keeps a glyph', () => {
    const { container, rerender } = render(
      <FieldMessage message="Hint" tone="info" />,
    );
    expect(container.querySelector('svg')).toBeNull();

    rerender(<FieldMessage message="Required" tone="error" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
