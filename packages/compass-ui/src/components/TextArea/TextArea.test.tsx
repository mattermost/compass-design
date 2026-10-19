import { describe, expect, it } from 'vitest';
import { getByRole, queryAllByRole, render } from '@/test-utils/render';
import TextArea from './TextArea';

describe('TextArea message', () => {
  it('error tone sets aria-invalid and role=alert', () => {
    const { container } = render(
      <TextArea id="purpose" label="Purpose" message="Required" />,
    );
    expect(
      container.querySelector('textarea')!.getAttribute('aria-invalid'),
    ).toBe('true');
    expect(getByRole('alert').id).toBe('purpose-message');
  });

  it('info tone does not set aria-invalid or alert', () => {
    const { container } = render(
      <TextArea
        id="notes"
        label="Notes"
        message="Optional"
        messageTone="info"
      />,
    );
    expect(
      container.querySelector('textarea')!.getAttribute('aria-invalid'),
    ).toBeNull();
    expect(queryAllByRole('alert')).toHaveLength(0);
  });

  it('aria-describedby includes message then counter', () => {
    const { container } = render(
      <TextArea
        id="desc"
        label="Description"
        message="Too long"
        maxLength={20}
        showCharacterCount
        defaultValue="hi"
        aria-describedby="hint"
      />,
    );
    expect(
      container.querySelector('textarea')!.getAttribute('aria-describedby'),
    ).toBe('hint desc-message desc-counter');
  });

  it('renders message and counter in one footer row', () => {
    const { container } = render(
      <TextArea
        id="desc"
        label="Description"
        message="Too long"
        maxLength={20}
        showCharacterCount
        defaultValue="hi"
      />,
    );
    const footer = container.querySelector('[class*="text-area__footer"]')!;
    expect(footer.contains(container.querySelector('#desc-message'))).toBe(
      true,
    );
    expect(footer.contains(container.querySelector('#desc-counter'))).toBe(
      true,
    );
  });
});

describe('TextArea clear', () => {
  it('does not render a clear button', () => {
    render(<TextArea label="Purpose" defaultValue="hello world" />);
    expect(queryAllByRole('button')).toHaveLength(0);
  });
});
