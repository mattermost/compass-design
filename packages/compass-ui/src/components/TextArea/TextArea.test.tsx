import { describe, expect, it } from 'vitest';
import { getByRole, queryAllByRole, render } from '@/test-utils/render';
import Button from '@/components/Button/Button';
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
});

describe('TextArea trailingAction', () => {
  it('does not render a clear button', () => {
    render(<TextArea label="Purpose" defaultValue="hello world" />);
    expect(queryAllByRole('button')).toHaveLength(0);
  });

  it('trailingAction is outside the bordered wrapper', () => {
    const { container } = render(
      <TextArea
        label="Invite"
        message="Ready"
        messageTone="success"
        trailingAction={<Button size="small">Copy</Button>}
      />,
    );
    const wrapper = container.querySelector('[class*="text-area__wrapper"]');
    const action = getByRole('button', 'Copy');
    expect(wrapper!.contains(action)).toBe(false);
  });
});
