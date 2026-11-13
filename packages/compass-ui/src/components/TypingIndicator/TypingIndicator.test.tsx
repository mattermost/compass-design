import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import TypingIndicator from './TypingIndicator';

describe('TypingIndicator', () => {
  it('shows the visible label and hides the dots from assistive tech', () => {
    const { container } = render(<TypingIndicator label="Alice is typing" />);
    const root = container.firstElementChild!;
    expect(root.getAttribute('role')).toBe('status');
    expect(root.textContent).toBe('Alice is typing');
    expect(root.querySelector('[aria-hidden="true"]')!.children).toHaveLength(
      3,
    );
  });

  it('announces typingLabel when there is no label', () => {
    const { container } = render(<TypingIndicator />);
    expect(container.firstElementChild!.textContent).toBe('Typing');
  });

  it('accepts ReactNode for label', () => {
    const { container } = render(
      <TypingIndicator label={<strong>Alice</strong>} />,
    );
    expect(container.querySelector('strong')!.textContent).toBe('Alice');
  });

  it('merges className and keeps the host role override out of the way', () => {
    const { container } = render(<TypingIndicator className="host" />);
    expect(container.firstElementChild!.classList).toContain('host');
  });
});
