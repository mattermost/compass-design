import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import MessageInput from './MessageInput';

function type(textarea: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value',
  )!.set!;
  act(() => {
    setter.call(textarea, value);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function pressEnter(textarea: HTMLTextAreaElement, shiftKey = false) {
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    shiftKey,
    bubbles: true,
    cancelable: true,
  });
  act(() => {
    textarea.dispatchEvent(event);
  });
  return event;
}

const sendButton = (container: HTMLElement) =>
  container.querySelector(
    'button[aria-label="Send message"]',
  ) as HTMLButtonElement;

describe('MessageInput', () => {
  it('passes rest attributes and className to the root', () => {
    const { container } = render(
      <MessageInput
        data-testid="composer"
        id="post_textbox"
        className="host-class"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.testid).toBe('composer');
    expect(root.id).toBe('post_textbox');
    expect(root.className).toContain('host-class');
  });

  it('calls onSend from the Send button and clears uncontrolled text', () => {
    const onSend = vi.fn();
    const { container } = render(<MessageInput onSend={onSend} />);
    const textarea = container.querySelector('textarea')!;
    type(textarea, 'Hello team');
    act(() => sendButton(container).click());
    expect(onSend).toHaveBeenCalledWith('Hello team');
    expect(textarea.value).toBe('');
  });

  it('sends on Enter and keeps Shift+Enter for new lines', () => {
    const onSend = vi.fn();
    const { container } = render(<MessageInput onSend={onSend} />);
    const textarea = container.querySelector('textarea')!;
    type(textarea, 'Hello');
    expect(pressEnter(textarea, true).defaultPrevented).toBe(false);
    expect(onSend).not.toHaveBeenCalled();
    expect(pressEnter(textarea).defaultPrevented).toBe(true);
    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('does not send empty text', () => {
    const onSend = vi.fn();
    const { container } = render(<MessageInput onSend={onSend} />);
    const textarea = container.querySelector('textarea')!;
    type(textarea, '   ');
    pressEnter(textarea);
    expect(onSend).not.toHaveBeenCalled();
  });

  it('leaves Enter alone and keeps text when onSend is not set', () => {
    const { container } = render(<MessageInput />);
    const textarea = container.querySelector('textarea')!;
    type(textarea, 'Draft');
    expect(pressEnter(textarea).defaultPrevented).toBe(false);
    act(() => sendButton(container).click());
    expect(textarea.value).toBe('Draft');
  });

  it('leaves clearing to the host when controlled', () => {
    const onSend = vi.fn();
    const { container } = render(
      <MessageInput value="Controlled" onChange={() => {}} onSend={onSend} />,
    );
    act(() => sendButton(container).click());
    expect(onSend).toHaveBeenCalledWith('Controlled');
    expect(container.querySelector('textarea')!.value).toBe('Controlled');
  });

  it('renders suggestions above the input only when provided', () => {
    const { container, rerender } = render(<MessageInput />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(1);
    rerender(<MessageInput suggestions={<ul data-testid="suggestions" />} />);
    const slot = root.firstElementChild as HTMLElement;
    expect(slot.querySelector('[data-testid="suggestions"]')).not.toBeNull();
    expect(slot.nextElementSibling?.querySelector('textarea')).not.toBeNull();
  });
});
