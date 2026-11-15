import { act, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import MessageInputWithSuggestions, {
  type ComposerSuggestionSource,
  type MessageInputWithSuggestionsProps,
} from './MessageInputWithSuggestions';

const USERS = ['alice', 'alina', 'bob'];
const people: ComposerSuggestionSource = (q) => [
  {
    key: 'members',
    options: USERS.filter((u) => u.startsWith(q)).map((u) => ({
      value: u,
      label: u,
    })),
  },
];
const channels: ComposerSuggestionSource = (q) => [
  {
    key: 'c',
    options: ['design', 'dev']
      .filter((c) => c.startsWith(q))
      .map((c) => ({ value: c, label: c })),
  },
];
const emoji: ComposerSuggestionSource = (q) => [
  {
    key: 'e',
    options: ['rocket', 'rose']
      .filter((e) => e.startsWith(q))
      .map((e) => ({ value: e, label: e })),
  },
];
const commands: ComposerSuggestionSource = (q) => [
  {
    key: 'x',
    options: ['away', 'archive']
      .filter((c) => c.startsWith(q))
      .map((c) => ({ value: c, label: c })),
  },
];
const SOURCES = { '@': people, '~': channels, ':': emoji, '/': commands };

const textarea = () => document.querySelector('textarea')!;
const options = () =>
  [...document.querySelectorAll('[role="option"]')].map((o) =>
    o.textContent?.trim(),
  );
const status = () => document.querySelector('[role="status"]');

function type(value: string, caret = value.length) {
  const el = textarea();
  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value',
  )!.set!;
  act(() => {
    setter.call(el, value);
    el.setSelectionRange(caret, caret);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function press(key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    textarea().dispatchEvent(event);
  });
  return event;
}

function Controlled(
  props: Partial<MessageInputWithSuggestionsProps> & { initial?: string },
) {
  const { initial = '', ...rest } = props;
  const [text, setText] = useState(initial);
  return (
    <MessageInputWithSuggestions
      sources={SOURCES}
      value={text}
      onChange={setText}
      {...rest}
    />
  );
}

describe('MessageInputWithSuggestions', () => {
  it('opens for each trigger with rows filtered by the query', () => {
    render(<MessageInputWithSuggestions sources={SOURCES} />);
    type('hi @al');
    expect(options()).toEqual(['alice', 'alina']);
    type('hi ~des');
    expect(options()).toEqual(['design']);
    type('go :ro');
    expect(options()).toEqual(['rocket', 'rose']);
    type('/a');
    expect(options()).toEqual(['away', 'archive']);
  });

  it('stays closed for plain text, emails, mid-text slashes and a lone colon', () => {
    render(<MessageInputWithSuggestions sources={SOURCES} />);
    for (const text of [
      'hello',
      'me@example.com',
      'see /away',
      'ok :)',
      '@a b',
    ]) {
      type(text);
      expect(document.querySelector('[role="listbox"]'), text).toBeNull();
    }
  });

  it('ignores a trigger that has no source', () => {
    render(<MessageInputWithSuggestions sources={{ '@': people }} />);
    type('~de');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('portals the list out of the composer', () => {
    const { container } = render(
      <MessageInputWithSuggestions sources={SOURCES} />,
    );
    type('@a');
    const listbox = document.querySelector('[role="listbox"]')!;
    expect(container.contains(listbox)).toBe(false);
    expect(document.body.contains(listbox)).toBe(true);
  });

  it('gives the field combobox semantics tied to the active row', () => {
    render(<MessageInputWithSuggestions sources={SOURCES} />);
    expect(textarea().getAttribute('aria-expanded')).toBe('false');
    type('@al');
    const field = textarea();
    expect(field.getAttribute('role')).toBe('combobox');
    expect(field.getAttribute('aria-expanded')).toBe('true');
    expect(field.getAttribute('aria-controls')).toBe(
      document.querySelector('[role="listbox"]')!.id,
    );
    const active = document.getElementById(
      field.getAttribute('aria-activedescendant')!,
    )!;
    expect(active.textContent).toContain('alice');
    press('ArrowDown');
    expect(
      document.getElementById(
        textarea().getAttribute('aria-activedescendant')!,
      )!.textContent,
    ).toContain('alina');
  });

  it('inserts the chosen row with Enter and Tab, replacing the query', () => {
    render(<Controlled />);
    type('hi @al');
    expect(press('Enter').defaultPrevented).toBe(true);
    expect(textarea().value).toBe('hi @alice ');
    type('hi @alice @b');
    press('Tab');
    expect(textarea().value).toBe('hi @alice @bob ');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('puts the caret after the inserted text', () => {
    render(<Controlled />);
    type('@al');
    press('Enter');
    expect(textarea().selectionStart).toBe('@alice '.length);
  });

  it('inserts at the caret in the middle of the text and keeps the rest', () => {
    render(<Controlled />);
    type('hey @al there', 7);
    expect(options()).toEqual(['alice', 'alina']);
    press('ArrowDown');
    press('Enter');
    expect(textarea().value).toBe('hey @alina there');
    expect(textarea().selectionStart).toBe('hey @alina '.length);
    // The caret left the trigger, so the list is closed.
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('formats emoji and slash rows and honors getInsertText', () => {
    const { rerender } = render(<Controlled />);
    type('x :ro');
    press('Enter');
    expect(textarea().value).toBe('x :rocket: ');
    type('/aw');
    press('Enter');
    expect(textarea().value).toBe('/away ');
    rerender(
      <Controlled getInsertText={(t, o) => `${t}${o.value.toUpperCase()}!`} />,
    );
    type('@bo');
    press('Enter');
    expect(textarea().value).toBe('@BOB! ');
  });

  it('accepts a row on click without losing focus and reports it', () => {
    const onSuggestionSelect = vi.fn();
    render(<Controlled onSuggestionSelect={onSuggestionSelect} />);
    textarea().focus();
    type('@a');
    const row = document.querySelectorAll('[role="option"]')[1] as HTMLElement;
    const down = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      row.dispatchEvent(down);
    });
    expect(down.defaultPrevented).toBe(true);
    act(() => row.click());
    expect(textarea().value).toBe('@alina ');
    expect(onSuggestionSelect).toHaveBeenCalledWith(
      '@',
      expect.objectContaining({ value: 'alina' }),
    );
  });

  it('does not send the draft when Enter accepts a row, and sends otherwise', () => {
    const onSend = vi.fn();
    render(<Controlled onSend={onSend} />);
    type('@al');
    press('Enter');
    expect(onSend).not.toHaveBeenCalled();
    expect(textarea().value).toBe('@alice ');
    press('Enter');
    expect(onSend).toHaveBeenCalledWith('@alice');
  });

  it('closes on Escape, marks it handled, and reopens for a new trigger', () => {
    render(<Controlled />);
    type('@al');
    expect(press('Escape').defaultPrevented).toBe(true);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    type('@ali');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    type('@ali x ~d');
    expect(options()).toEqual(['design', 'dev']);
    type('');
    type('@a');
    expect(options()).toEqual(['alice', 'alina']);
  });

  it('closes on an outside press but not on a press in the composer', () => {
    render(<Controlled />);
    type('@a');
    act(() => {
      textarea().dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(options()).toHaveLength(2);
    act(() => {
      document.body.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true }),
      );
    });
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('follows the caret: moving out of the trigger closes the list', () => {
    render(<Controlled />);
    type('@al b', 3);
    expect(options()).toEqual(['alice', 'alina']);
    const el = textarea();
    act(() => {
      el.setSelectionRange(5, 5);
      el.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }),
      );
    });
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('stays closed while text is selected', () => {
    render(<Controlled />);
    type('@al');
    const el = textarea();
    act(() => {
      el.setSelectionRange(0, 3);
      el.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }),
      );
    });
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('stays closed during IME composition and leaves Enter to the IME', () => {
    const onSend = vi.fn();
    render(<Controlled onSend={onSend} />);
    act(() => {
      textarea().dispatchEvent(
        new CompositionEvent('compositionstart', { bubbles: true }),
      );
    });
    type('@al');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    const enter = press('Enter', { isComposing: true } as KeyboardEventInit);
    expect(enter.defaultPrevented).toBe(false);
    expect(textarea().value).toBe('@al');
    act(() => {
      textarea().dispatchEvent(
        new CompositionEvent('compositionend', { bubbles: true }),
      );
    });
    expect(options()).toEqual(['alice', 'alina']);
  });

  it('leaves Shift+Enter to the field', () => {
    render(<Controlled />);
    type('@al');
    expect(press('Enter', { shiftKey: true }).defaultPrevented).toBe(false);
    expect(textarea().value).toBe('@al');
  });

  it('shows the empty state, or closes when emptyLabel is null', () => {
    const { rerender } = render(<Controlled />);
    type('@zzz');
    expect(status()?.textContent).toBe('No matches');
    expect(textarea().getAttribute('aria-expanded')).toBe('true');
    expect(press('Enter').defaultPrevented).toBe(false);
    rerender(<Controlled emptyLabel={null} />);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('shows the loading state while a source reports loading, then the rows', () => {
    let loading = true;
    const remote: ComposerSuggestionSource = (q) => ({
      sections: loading ? [] : (people(q) as never),
      loading,
    });
    const { rerender } = render(<Controlled sources={{ '@': remote }} />);
    type('@a');
    expect(status()?.textContent).toBe('Loading…');
    loading = false;
    rerender(<Controlled sources={{ '@': remote }} initial="@a" />);
    type('@al');
    expect(options()).toEqual(['alice', 'alina']);
  });

  it('works uncontrolled and clears after sending', () => {
    const onSend = vi.fn();
    render(<MessageInputWithSuggestions sources={SOURCES} onSend={onSend} />);
    type('@bo');
    press('Enter');
    expect(textarea().value).toBe('@bob ');
    press('Enter');
    expect(onSend).toHaveBeenCalledWith('@bob');
    expect(textarea().value).toBe('');
  });

  it('runs the host key handler first and lets it block the list', () => {
    render(
      <Controlled
        textareaProps={{
          onKeyDown: (e) => {
            if (e.key === 'Enter') e.preventDefault();
          },
        }}
      />,
    );
    type('@al');
    press('Enter');
    expect(textarea().value).toBe('@al');
  });

  it('passes the host inputRef and rest props through', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    const { container } = render(
      <MessageInputWithSuggestions
        sources={SOURCES}
        inputRef={ref}
        data-testid="composer"
      />,
    );
    expect(ref.current).toBe(textarea());
    expect(container.querySelector('[data-testid="composer"]')).not.toBeNull();
  });

  it('measures again when the anchor moves (the input grows), but not on every keystroke', () => {
    let top = 400;
    const spy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => new DOMRect(10, top, 300, 40));
    try {
      render(<Controlled />);
      type('@a');
      const surface = () =>
        document.querySelector('[role="listbox"]')!.parentElement!
          .parentElement!.parentElement;
      const first = surface();
      type('@al');
      expect(surface()).toBe(first);
      top = 360;
      type('@ali');
      const second = surface();
      expect(second).not.toBe(first);
      expect(second!.style.bottom).not.toBe('');
    } finally {
      spy.mockRestore();
    }
  });

  it('caps the list height to the room above the input', () => {
    const spy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => new DOMRect(10, 150, 300, 40));
    try {
      render(<Controlled />);
      type('@a');
      const scroller = document
        .querySelector('[role="listbox"]')!
        .closest('[style*="max-height"]') as HTMLElement;
      // 150px above the box (plus the 4px overlap), less the border.
      expect(parseInt(scroller.style.maxHeight, 10)).toBeLessThan(320);
      expect(parseInt(scroller.style.maxHeight, 10)).toBeGreaterThanOrEqual(96);
    } finally {
      spy.mockRestore();
    }
  });
});
