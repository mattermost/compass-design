import { act } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  click,
  focus,
  getByRole,
  hover,
  keyDown,
  queryAllByRole,
  render,
  type,
  withoutScrollIntoView,
} from '@/test-utils/render';
import Combobox from './Combobox';
import type { ComboboxOption, ComboboxProps } from './Combobox';

const MODELS: ComboboxOption[] = [
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
];

function input() {
  return getByRole('combobox') as HTMLInputElement;
}

function openMenu() {
  focus(input());
}

function chipLabels() {
  return Array.from(document.querySelectorAll('[data-chip]')).map(
    (chip) => chip.textContent,
  );
}

describe('Combobox loading', () => {
  it('shows a loading row instead of the empty message', () => {
    render(<Combobox aria-label="Users" options={[]} loading />);
    openMenu();
    expect(getByRole('status').textContent).toBe('Loading…');
    expect(document.body.textContent).not.toContain('No results');
    expect(input().getAttribute('aria-busy')).toBe('true');
  });

  it('accepts a custom loading message', () => {
    render(
      <Combobox
        aria-label="Users"
        options={[]}
        loading
        loadingMessage={<span>Searching…</span>}
      />,
    );
    openMenu();
    expect(getByRole('status').textContent).toBe('Searching…');
  });

  it('shows the empty message once loading finishes', () => {
    const { rerender } = render(
      <Combobox aria-label="Users" options={[]} loading />,
    );
    openMenu();
    rerender(<Combobox aria-label="Users" options={[]} loading={false} />);
    expect(queryAllByRole('status')).toHaveLength(0);
    expect(document.body.textContent).toContain('No results');
    expect(input().hasAttribute('aria-busy')).toBe(false);
  });
});

describe('Combobox selectedOptions', () => {
  const alice: ComboboxOption = { value: 'u1', label: 'Alice' };
  const bob: ComboboxOption = { value: 'u2', label: 'Bob' };

  it('keeps chips for values missing from the current options', () => {
    const props: ComboboxProps = {
      'aria-label': 'Users',
      multiple: true,
      filter: false,
      value: ['u1', 'u2'],
      selectedOptions: [alice, bob],
      options: [alice],
    };
    const { rerender } = render(<Combobox {...props} />);
    expect(chipLabels()).toEqual(['Alice', 'Bob']);

    rerender(<Combobox {...props} options={[]} />);
    expect(chipLabels()).toEqual(['Alice', 'Bob']);
  });

  it('labels a single value that is not in options', () => {
    render(
      <Combobox
        aria-label="Channel"
        value="u1"
        selectedOptions={[alice]}
        options={[bob]}
      />,
    );
    expect(input().value).toBe('Alice');
  });

  it('without selectedOptions, drops chips for unlisted values as before', () => {
    render(
      <Combobox
        aria-label="Users"
        multiple
        value={['u1', 'u2']}
        options={[bob, alice]}
      />,
    );
    expect(chipLabels()).toEqual(['Bob', 'Alice']);
  });
});

describe('Combobox creatable', () => {
  function createRow() {
    return document.getElementById(
      `${input().getAttribute('aria-controls')}-create`,
    );
  }

  it('offers a create row for unmatched input and commits it with Enter', () => {
    const onChange = vi.fn();
    render(
      <Combobox
        aria-label="Model"
        options={MODELS}
        creatable
        onChange={onChange}
      />,
    );
    openMenu();
    type(input(), '  o3-pro ');

    const row = createRow();
    expect(row?.getAttribute('role')).toBe('option');
    expect(row?.getAttribute('aria-selected')).toBe('false');
    expect(row?.textContent).toBe('Create "o3-pro"');
    expect(input().getAttribute('aria-activedescendant')).toBe(row?.id);

    keyDown(input(), 'Enter');
    expect(onChange).toHaveBeenCalledWith('o3-pro');
  });

  it('displays a created single value that is not in options', () => {
    render(
      <Combobox aria-label="Model" options={MODELS} creatable value="o3-pro" />,
    );
    expect(input().value).toBe('o3-pro');
  });

  it('reaches the create row with ArrowDown after matching options', () => {
    const onChange = vi.fn();
    render(
      <Combobox
        aria-label="Model"
        options={MODELS}
        creatable
        onChange={onChange}
      />,
    );
    openMenu();
    type(input(), 'gpt-4');
    expect(input().getAttribute('aria-activedescendant')).toContain('-option-');

    keyDown(input(), 'ArrowDown');
    keyDown(input(), 'ArrowDown');
    expect(input().getAttribute('aria-activedescendant')).toBe(createRow()?.id);

    keyDown(input(), 'Enter');
    expect(onChange).toHaveBeenCalledWith('gpt-4');
  });

  it('hides the create row when the input matches an option', () => {
    render(<Combobox aria-label="Model" options={MODELS} creatable />);
    openMenu();
    type(input(), 'GPT-4O');
    expect(createRow()).toBeNull();
  });

  it('hands creation to onCreateOption instead of onChange', () => {
    const onChange = vi.fn();
    const onCreateOption = vi.fn();
    render(
      <Combobox
        aria-label="Model"
        options={MODELS}
        creatable
        onChange={onChange}
        onCreateOption={onCreateOption}
        formatCreateLabel={(text) => <span>Use {text}</span>}
      />,
    );
    openMenu();
    type(input(), 'custom');
    expect(createRow()?.textContent).toBe('Use custom');

    createRow()?.click();
    expect(onCreateOption).toHaveBeenCalledWith('custom');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('appends created values in multiple mode and shows them as chips', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Combobox
        aria-label="Tags"
        multiple
        options={MODELS}
        creatable
        value={['gpt-4o']}
        onChange={onChange}
      />,
    );
    openMenu();
    type(input(), 'beta');
    keyDown(input(), 'Enter');
    expect(onChange).toHaveBeenCalledWith(['gpt-4o', 'beta']);

    rerender(
      <Combobox
        aria-label="Tags"
        multiple
        options={MODELS}
        creatable
        value={['gpt-4o', 'beta']}
        onChange={onChange}
      />,
    );
    expect(chipLabels()).toEqual(['gpt-4o', 'beta']);
  });

  it('does not offer a create row unless creatable', () => {
    render(<Combobox aria-label="Model" options={MODELS} />);
    openMenu();
    type(input(), 'o3-pro');
    expect(createRow()).toBeNull();
    expect(document.body.textContent).toContain('No results');
  });
});

describe('Combobox clearable', () => {
  function clearButton() {
    return queryAllByRole('button', 'Clear')[0] as
      | HTMLButtonElement
      | undefined;
  }

  it('renders no clear button unless clearable', () => {
    render(<Combobox aria-label="Model" options={MODELS} value="gpt-4o" />);
    expect(clearButton()).toBeUndefined();
  });

  it('renders no clear button without a value', () => {
    render(
      <Combobox aria-label="Model" options={MODELS} value={null} clearable />,
    );
    expect(clearButton()).toBeUndefined();
  });

  it('calls onChange(null) and returns focus to the input', () => {
    const onChange = vi.fn();
    render(
      <Combobox
        aria-label="Model"
        options={MODELS}
        value="gpt-4o"
        onChange={onChange}
        clearable
      />,
    );
    const button = clearButton()!;
    expect(button.tagName).toBe('BUTTON');
    expect(button.tabIndex).toBe(0);
    click(button);
    expect(onChange).toHaveBeenCalledWith(null);
    expect(document.activeElement).toBe(input());
  });

  it('empties an uncontrolled value and hides itself', () => {
    render(
      <Combobox
        aria-label="Model"
        options={MODELS}
        defaultValue="gpt-4o"
        clearable
      />,
    );
    expect(input().value).toBe('gpt-4o');
    click(clearButton()!);
    expect(input().value).toBe('');
    expect(clearButton()).toBeUndefined();
  });

  it('clears a controlled input value through onInputChange', () => {
    const onInputChange = vi.fn();
    render(
      <Combobox
        aria-label="Model"
        options={MODELS}
        value="gpt-4o"
        inputValue="gpt-4o"
        onInputChange={onInputChange}
        clearable
      />,
    );
    click(clearButton()!);
    expect(onInputChange).toHaveBeenCalledWith('');
  });

  it('accepts a translated clearLabel', () => {
    render(
      <Combobox
        aria-label="Model"
        options={MODELS}
        value="gpt-4o"
        clearable
        clearLabel="Auswahl löschen"
      />,
    );
    expect(getByRole('button', 'Auswahl löschen')).toBeTruthy();
  });

  it('is a no-op in multiple mode and when disabled', () => {
    const { rerender } = render(
      <Combobox
        aria-label="Models"
        options={MODELS}
        multiple
        value={['gpt-4o']}
        clearable
      />,
    );
    expect(clearButton()).toBeUndefined();
    rerender(
      <Combobox
        aria-label="Model"
        options={MODELS}
        value="gpt-4o"
        clearable
        disabled
      />,
    );
    expect(clearButton()).toBeUndefined();
  });
});

describe('Combobox without scrollIntoView', () => {
  withoutScrollIntoView();

  it('opens and moves the highlight with the arrow keys', () => {
    render(<Combobox aria-label="Model" options={MODELS} />);
    expect('scrollIntoView' in input()).toBe(false);

    openMenu();
    expect(input().getAttribute('aria-expanded')).toBe('true');

    keyDown(input(), 'ArrowDown');
    const first = input().getAttribute('aria-activedescendant');
    expect(first).toBeTruthy();

    keyDown(input(), 'ArrowDown');
    const second = input().getAttribute('aria-activedescendant');
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);

    keyDown(input(), 'ArrowUp');
    expect(input().getAttribute('aria-activedescendant')).toBe(first);
  });
});

describe('Combobox menuItemProps', () => {
  const CHANNELS: ComboboxOption[] = [
    { value: 'ts', label: 'Town Square', secondaryLabel: 'Engineering' },
    { value: 'ot', label: 'Off-Topic', secondaryLabel: 'Design' },
  ];

  function rows() {
    return queryAllByRole('option');
  }

  function span(row: Element, text: string) {
    return Array.from(row.querySelectorAll('span')).find(
      (s) => s.textContent === text,
    ) as HTMLElement;
  }

  function isInline(row: Element, label: string, secondary: string) {
    return (
      span(row, label).parentElement === span(row, secondary).parentElement
    );
  }

  it('renders secondary labels below by default', () => {
    render(<Combobox aria-label="Channel" options={CHANNELS} />);
    openMenu();
    expect(isInline(rows()[0], 'Town Square', 'Engineering')).toBe(false);
  });

  it('applies menuItemProps to every option row', () => {
    render(
      <Combobox
        aria-label="Channel"
        options={CHANNELS}
        menuItemProps={{ secondaryLabelPosition: 'inline' }}
      />,
    );
    openMenu();
    expect(isInline(rows()[0], 'Town Square', 'Engineering')).toBe(true);
    expect(isInline(rows()[1], 'Off-Topic', 'Design')).toBe(true);
  });

  it('lets an option override the Combobox menuItemProps and merges className', () => {
    render(
      <Combobox
        aria-label="Channel"
        menuItemProps={{ secondaryLabelPosition: 'inline', className: 'all' }}
        options={[
          CHANNELS[0],
          {
            ...CHANNELS[1],
            menuItemProps: {
              secondaryLabelPosition: 'below',
              className: 'one',
            },
          },
        ]}
      />,
    );
    openMenu();
    expect(isInline(rows()[0], 'Town Square', 'Engineering')).toBe(true);
    expect(isInline(rows()[1], 'Off-Topic', 'Design')).toBe(false);
    expect(rows()[0].classList.contains('all')).toBe(true);
    expect(rows()[1].classList.contains('all')).toBe(true);
    expect(rows()[1].classList.contains('one')).toBe(true);
  });

  it('forwards other MenuItem props such as tag and tagLabel', () => {
    render(
      <Combobox
        aria-label="Channel"
        options={[
          {
            value: 'ts',
            label: 'Town Square',
            menuItemProps: { tag: true, tagLabel: 'Beta' },
          },
        ]}
      />,
    );
    openMenu();
    expect(rows()[0].textContent).toContain('Beta');
  });

  it('passes onPointerUp through, since Combobox rows select on click', () => {
    const onPointerUp = vi.fn();
    const onChange = vi.fn();
    render(
      <Combobox
        aria-label="Channel"
        options={CHANNELS}
        onChange={onChange}
        menuItemProps={{ onPointerUp }}
      />,
    );
    openMenu();
    act(() => {
      rows()[0].dispatchEvent(new Event('pointerup', { bubbles: true }));
    });
    expect(onPointerUp).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the props Combobox owns when menuItemProps tries to set them', () => {
    const onChange = vi.fn();
    const onClick = vi.fn();
    render(
      <Combobox
        aria-label="Channel"
        options={CHANNELS}
        onChange={onChange}
        menuItemProps={
          { role: 'button', 'aria-selected': true, onClick } as never
        }
      />,
    );
    openMenu();
    expect(rows()).toHaveLength(2);
    expect(rows()[0].getAttribute('aria-selected')).toBe('false');
    click(rows()[0]);
    expect(onChange).toHaveBeenCalledWith('ts');
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Combobox hover and scrolling', () => {
  const original = Element.prototype.scrollIntoView;
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    scrollIntoView.mockClear();
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  afterEach(() => {
    Element.prototype.scrollIntoView = original;
  });

  const OPTIONS: ComboboxOption[] = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
    { value: 'c', label: 'Gamma' },
  ];

  it('highlights a hovered row without scrolling it into view', () => {
    render(<Combobox aria-label="Letter" options={OPTIONS} />);
    openMenu();
    const rows = queryAllByRole('option');
    scrollIntoView.mockClear();

    hover(rows[2]);

    expect(input().getAttribute('aria-activedescendant')).toBe(rows[2].id);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('still scrolls the highlighted row into view for keyboard navigation', () => {
    render(<Combobox aria-label="Letter" options={OPTIONS} />);
    openMenu();
    hover(queryAllByRole('option')[2]);
    scrollIntoView.mockClear();

    keyDown(input(), 'ArrowUp');

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });
});

describe('Combobox leadingTeamAvatar', () => {
  it('renders a menu-variant team avatar in the row', () => {
    render(
      <Combobox
        aria-label="Team"
        options={[
          {
            value: 'core',
            label: 'Core Team',
            leadingTeamAvatar: { initials: 'Co', alt: 'Core Team' },
          },
        ]}
      />,
    );
    openMenu();
    const avatar = document.querySelector('[class*="team-avatar--menu"]');
    expect(avatar).not.toBeNull();
    expect(avatar?.textContent).toBe('Co');
  });

  it('renders without alt', () => {
    render(
      <Combobox
        aria-label="Team"
        options={[
          {
            value: 'core',
            label: 'Core Team',
            leadingTeamAvatar: { initials: 'Co' },
          },
        ]}
      />,
    );
    openMenu();
    expect(
      document.querySelector('[class*="team-avatar--menu"]'),
    ).not.toBeNull();
  });

  it('derives initials from the label when the avatar has neither image nor initials', () => {
    render(
      <Combobox
        aria-label="Team"
        options={[
          {
            value: 'design',
            label: 'Design Team',
            leadingTeamAvatar: { alt: 'Design Team' },
          },
        ]}
      />,
    );
    openMenu();
    expect(
      document.querySelector('[class*="team-avatar--menu"]')?.textContent,
    ).toBe('De');
  });

  it('does not split astral characters when deriving initials from the label', () => {
    render(
      <Combobox
        aria-label="Team"
        options={[
          {
            value: 'rocket',
            label: 'A🚀 Team',
            leadingTeamAvatar: { alt: 'Rocket Team' },
          },
        ]}
      />,
    );
    openMenu();
    expect(
      document.querySelector('[class*="team-avatar--menu"]')?.textContent,
    ).toBe('A🚀');
  });
});

describe('Combobox input pass-through', () => {
  type KeySeen = Array<[string, boolean]>;

  function recordKeys(seen: KeySeen) {
    return (e: KeyboardEvent<HTMLInputElement>) => {
      seen.push([e.key, e.defaultPrevented]);
    };
  }

  function setupUser() {
    const user = userEvent.setup();
    return {
      click: (el: Element) => act(() => user.click(el)),
      keyboard: (keys: string) => act(() => user.keyboard(keys)),
      tab: (options?: { shift?: boolean }) => act(() => user.tab(options)),
      type: (el: Element, text: string) => act(() => user.type(el, text)),
    };
  }

  describe('attributes', () => {
    it('puts data-* on the input and className on the root', () => {
      const { container } = render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          data-testid="model"
          data-qa="x"
          className="host"
        />,
      );
      const root = container.firstElementChild!;
      expect(input().getAttribute('data-testid')).toBe('model');
      expect(input().getAttribute('data-qa')).toBe('x');
      expect(root.classList).toContain('host');
      expect(root.hasAttribute('data-testid')).toBe(false);
      expect(input().classList).not.toContain('host');
      expect(document.querySelectorAll('[data-testid="model"]')).toHaveLength(
        1,
      );
    });

    it('passes other native attributes to the input', () => {
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          aria-labelledby="lbl"
          aria-errormessage="err"
          aria-details="details"
          title="Pick one"
          tabIndex={-1}
          inputMode="search"
          enterKeyHint="search"
          lang="en"
          dir="ltr"
          style={{ minWidth: 10 }}
        />,
      );
      expect(input().getAttribute('aria-labelledby')).toBe('lbl');
      expect(input().getAttribute('aria-errormessage')).toBe('err');
      expect(input().getAttribute('aria-details')).toBe('details');
      expect(input().getAttribute('title')).toBe('Pick one');
      expect(input().tabIndex).toBe(-1);
      expect(input().getAttribute('inputmode')).toBe('search');
      expect(input().getAttribute('enterkeyhint')).toBe('search');
      expect(input().getAttribute('lang')).toBe('en');
      expect(input().getAttribute('dir')).toBe('ltr');
      expect(input().style.minWidth).toBe('10px');
    });

    it('keeps the host aria-describedby through open, loading and invalid', () => {
      const { rerender } = render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          aria-describedby="help err"
        />,
      );
      expect(input().getAttribute('aria-describedby')).toBe('help err');
      openMenu();
      expect(input().getAttribute('aria-describedby')).toBe('help err');
      rerender(
        <Combobox
          aria-label="Model"
          options={MODELS}
          aria-describedby="help err"
          loading
          invalid
        />,
      );
      expect(input().getAttribute('aria-describedby')).toBe('help err');
      expect(input().getAttribute('aria-invalid')).toBe('true');
      expect(input().getAttribute('aria-busy')).toBe('true');
    });

    it('updates and removes aria-describedby when the host changes it', () => {
      const { rerender } = render(
        <Combobox aria-label="Model" options={MODELS} aria-describedby="a" />,
      );
      rerender(
        <Combobox aria-label="Model" options={MODELS} aria-describedby="b" />,
      );
      expect(input().getAttribute('aria-describedby')).toBe('b');
      rerender(<Combobox aria-label="Model" options={MODELS} />);
      expect(input().hasAttribute('aria-describedby')).toBe(false);
    });

    it('renders no aria-describedby for an empty string', () => {
      render(
        <Combobox aria-label="Model" options={MODELS} aria-describedby="" />,
      );
      expect(input().hasAttribute('aria-describedby')).toBe(false);
    });

    it('keeps the attributes it owns over forced host values', () => {
      const forced: Record<string, unknown> = {
        role: 'textbox',
        type: 'search',
        autoComplete: 'on',
        spellCheck: true,
        'aria-expanded': true,
        'aria-controls': 'other',
        'aria-autocomplete': 'none',
        'aria-activedescendant': 'other',
        'aria-busy': true,
        'aria-invalid': true,
        'aria-required': true,
      };
      render(
        <Combobox id="cb" aria-label="Model" options={MODELS} {...forced} />,
      );
      const el = input();
      expect(el.getAttribute('role')).toBe('combobox');
      expect(el.type).toBe('text');
      expect(el.getAttribute('autocomplete')).toBe('off');
      expect(el.getAttribute('spellcheck')).toBe('false');
      expect(el.getAttribute('aria-expanded')).toBe('false');
      expect(el.getAttribute('aria-controls')).toBe('cb-listbox');
      expect(el.getAttribute('aria-autocomplete')).toBe('list');
      expect(el.hasAttribute('aria-activedescendant')).toBe(false);
      expect(el.hasAttribute('aria-busy')).toBe(false);
      expect(el.hasAttribute('aria-invalid')).toBe(false);
      expect(el.hasAttribute('aria-required')).toBe(false);

      openMenu();
      expect(el.getAttribute('aria-expanded')).toBe('true');
      expect(el.getAttribute('aria-activedescendant')).toMatch(
        /^cb-listbox-option-/,
      );
    });

    it('keeps id on the input so the label stays linked', () => {
      render(
        <Combobox id="cb" label="Model" options={MODELS} data-testid="m" />,
      );
      expect(input().id).toBe('cb');
      expect(input().getAttribute('data-testid')).toBe('m');
      expect(document.querySelector('label[for="cb"]')).not.toBeNull();
    });

    it('focuses the input on mount with autoFocus, which opens the menu', () => {
      // eslint-disable-next-line jsx-a11y/no-autofocus -- autoFocus pass-through is the behavior under test
      render(<Combobox aria-label="Model" options={MODELS} autoFocus />);
      expect(document.activeElement).toBe(input());
      expect(input().getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('required', () => {
    it('sets aria-required without native required in single mode', () => {
      render(<Combobox aria-label="Model" options={MODELS} required />);
      expect(input().getAttribute('aria-required')).toBe('true');
      expect(input().required).toBe(false);
      expect(input().hasAttribute('required')).toBe(false);
    });

    it('keeps aria-required and skips native required in multiple mode, with and without chips', () => {
      const { rerender } = render(
        <Combobox
          aria-label="Models"
          options={MODELS}
          multiple
          required
          value={[]}
        />,
      );
      expect(input().getAttribute('aria-required')).toBe('true');
      expect(input().hasAttribute('required')).toBe(false);

      rerender(
        <Combobox
          aria-label="Models"
          options={MODELS}
          multiple
          required
          value={['gpt-4o']}
        />,
      );
      expect(chipLabels()).toEqual(['gpt-4o']);
      expect(input().value).toBe('');
      expect(input().getAttribute('aria-required')).toBe('true');
      expect(input().hasAttribute('required')).toBe(false);
    });

    it('does not block form submission once chips are picked', () => {
      const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
      render(
        <form>
          <Combobox
            aria-label="Models"
            options={MODELS}
            multiple
            required
            value={['gpt-4o']}
          />
        </form>,
      );
      const form = document.querySelector('form')!;
      form.addEventListener('submit', onSubmit);
      expect(form.checkValidity()).toBe(true);
      act(() => form.requestSubmit());
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('keeps aria-required and pass-through attributes when disabled', () => {
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          required
          disabled
          data-testid="m"
        />,
      );
      expect(input().getAttribute('aria-required')).toBe('true');
      expect(input().getAttribute('data-testid')).toBe('m');
      expect(input().disabled).toBe(true);
    });

    it('toggles aria-required when required changes', () => {
      const { rerender } = render(
        <Combobox aria-label="Model" options={MODELS} />,
      );
      rerender(<Combobox aria-label="Model" options={MODELS} required />);
      expect(input().getAttribute('aria-required')).toBe('true');
      rerender(
        <Combobox aria-label="Model" options={MODELS} required={false} />,
      );
      expect(input().hasAttribute('aria-required')).toBe(false);
    });
  });

  describe('handlers', () => {
    it('calls onFocus with the input event and still opens the menu', async () => {
      const targets: EventTarget[] = [];
      const onFocus = vi.fn((e: FocusEvent<HTMLInputElement>) => {
        targets.push(e.target, e.currentTarget);
      });
      const user = setupUser();
      render(
        <Combobox aria-label="Model" options={MODELS} onFocus={onFocus} />,
      );
      await user.click(input());
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(targets).toEqual([input(), input()]);
      expect(input().getAttribute('aria-expanded')).toBe('true');
    });

    it('calls onBlur when focus leaves the input', async () => {
      const onBlur = vi.fn();
      const user = setupUser();
      render(
        <>
          <Combobox aria-label="Model" options={MODELS} onBlur={onBlur} />
          <button type="button">After</button>
        </>,
      );
      await user.click(input());
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur.mock.calls[0][0].target).toBe(input());
      expect(document.activeElement?.textContent).toBe('After');
      expect(input().getAttribute('aria-expanded')).toBe('false');
    });

    it('calls onBlur when focus moves to the clear button, but not when the clear button blurs', async () => {
      const onBlur = vi.fn();
      const user = setupUser();
      render(
        <>
          <Combobox
            aria-label="Model"
            options={MODELS}
            value="gpt-4o"
            clearable
            onBlur={onBlur}
          />
          <button type="button">After</button>
        </>,
      );
      const clear = queryAllByRole('button', 'Clear')[0];
      focus(input());
      await user.tab();
      expect(document.activeElement).toBe(clear);
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur.mock.calls[0][0].target).toBe(input());

      await user.tab();
      expect(document.activeElement?.textContent).toBe('After');
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('still calls clearButtonProps.onBlur alongside the input onBlur', async () => {
      const onBlur = vi.fn();
      const onClearBlur = vi.fn();
      const user = setupUser();
      render(
        <>
          <Combobox
            aria-label="Model"
            options={MODELS}
            value="gpt-4o"
            clearable
            clearButtonProps={{ onBlur: onClearBlur }}
            onBlur={onBlur}
          />
          <button type="button">After</button>
        </>,
      );
      focus(input());
      await user.tab();
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onClearBlur).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when focus moves to a chip's remove button", () => {
      const onBlur = vi.fn();
      render(
        <Combobox
          aria-label="Models"
          options={MODELS}
          multiple
          value={['gpt-4o']}
          onBlur={onBlur}
        />,
      );
      const remove =
        document.querySelector<HTMLButtonElement>('[data-chip] button')!;
      focus(input());
      focus(remove);
      expect(onBlur).toHaveBeenCalledTimes(1);
      act(() => remove.blur());
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("doesn't call onBlur when an option is clicked", async () => {
      const onBlur = vi.fn();
      const onChange = vi.fn();
      const user = setupUser();
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          onChange={onChange}
          onBlur={onBlur}
        />,
      );
      await user.click(input());
      await user.click(queryAllByRole('option')[1]);
      expect(onChange).toHaveBeenCalledWith('gpt-4o-mini');
      expect(onBlur).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(input());
    });

    it('calls onFocus again and reopens the menu when the clear button returns focus', async () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      const user = setupUser();
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          defaultValue="gpt-4o"
          clearable
          onFocus={onFocus}
          onBlur={onBlur}
        />,
      );
      await user.click(input());
      await user.keyboard('{Escape}');
      expect(input().getAttribute('aria-expanded')).toBe('false');
      expect(onFocus).toHaveBeenCalledTimes(1);

      await user.click(queryAllByRole('button', 'Clear')[0]);
      expect(input().value).toBe('');
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onFocus).toHaveBeenCalledTimes(2);
      expect(document.activeElement).toBe(input());
      expect(input().getAttribute('aria-expanded')).toBe('true');
    });

    it('calls onKeyDown after Combobox, with defaultPrevented when it handled the key', async () => {
      const seen: KeySeen = [];
      const onChange = vi.fn();
      const user = setupUser();
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          onChange={onChange}
          onKeyDown={recordKeys(seen)}
        />,
      );
      await user.click(input());
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Escape}');
      expect(input().getAttribute('aria-expanded')).toBe('false');
      await user.keyboard('{Escape}');
      await user.keyboard('{Enter}');
      await user.keyboard('a');
      expect(seen).toEqual([
        ['ArrowDown', true],
        ['Escape', true],
        ['Escape', false],
        ['Enter', false],
        ['a', false],
      ]);
      expect(onChange).not.toHaveBeenCalled();
      expect(input().value).toBe('a');
    });

    it('reports ArrowDown / ArrowUp as handled when they open a closed menu', async () => {
      const seen: KeySeen = [];
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          onKeyDown={recordKeys(seen)}
        />,
      );
      openMenu();
      keyDown(input(), 'Escape');
      keyDown(input(), 'ArrowUp');
      expect(input().getAttribute('aria-expanded')).toBe('true');
      keyDown(input(), 'Escape');
      keyDown(input(), 'ArrowDown');
      expect(input().getAttribute('aria-expanded')).toBe('true');
      expect(seen).toEqual([
        ['Escape', true],
        ['ArrowUp', true],
        ['Escape', true],
        ['ArrowDown', true],
      ]);
    });

    it('reports Home / End as handled only while the menu is open', () => {
      const seen: KeySeen = [];
      render(
        <Combobox
          id="cb"
          aria-label="Model"
          options={MODELS}
          onKeyDown={recordKeys(seen)}
        />,
      );
      openMenu();
      keyDown(input(), 'End');
      const last = input().getAttribute('aria-activedescendant');
      keyDown(input(), 'Home');
      expect(input().getAttribute('aria-activedescendant')).not.toBe(last);
      keyDown(input(), 'Escape');
      keyDown(input(), 'Home');
      keyDown(input(), 'End');
      expect(seen).toEqual([
        ['End', true],
        ['Home', true],
        ['Escape', true],
        ['Home', false],
        ['End', false],
      ]);
    });

    it('selects with Enter before the host sees the key', async () => {
      const order: string[] = [];
      const user = setupUser();
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          onChange={(value) => order.push(`change:${String(value)}`)}
          onKeyDown={(e) => order.push(`key:${e.key}:${e.defaultPrevented}`)}
        />,
      );
      await user.click(input());
      await user.keyboard('{Enter}');
      expect(order).toEqual(['change:gpt-4o', 'key:Enter:true']);
    });

    it("doesn't let host preventDefault() veto Combobox key handling", async () => {
      const onChange = vi.fn();
      const user = setupUser();
      render(
        <Combobox
          id="cb"
          aria-label="Model"
          options={MODELS}
          onChange={onChange}
          onKeyDown={(e) => e.preventDefault()}
        />,
      );
      await user.click(input());
      const first = input().getAttribute('aria-activedescendant');
      await user.keyboard('{ArrowDown}');
      const second = input().getAttribute('aria-activedescendant');
      expect(second).toMatch(/^cb-listbox-option-/);
      expect(second).not.toBe(first);
      await user.keyboard('{Enter}');
      expect(onChange).toHaveBeenCalledWith('gpt-4o-mini');
    });

    it('closes on Tab and reports it as not handled', async () => {
      const seen: KeySeen = [];
      const user = setupUser();
      render(
        <>
          <Combobox
            aria-label="Model"
            options={MODELS}
            onKeyDown={recordKeys(seen)}
          />
          <button type="button">After</button>
        </>,
      );
      await user.click(input());
      await user.tab();
      expect(seen).toEqual([['Tab', false]]);
      expect(input().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement?.textContent).toBe('After');
    });

    it('reports Backspace as handled when it removes a chip in multiple mode', async () => {
      const seen: KeySeen = [];
      const onChange = vi.fn();
      const user = setupUser();
      render(
        <Combobox
          aria-label="Models"
          options={MODELS}
          multiple
          value={['gpt-4o', 'gpt-4o-mini']}
          onChange={onChange}
          onKeyDown={recordKeys(seen)}
        />,
      );
      focus(input());
      await user.keyboard('{Backspace}');
      expect(onChange).toHaveBeenCalledWith(['gpt-4o']);
      expect(seen).toEqual([['Backspace', true]]);
    });

    it('reports Backspace as not handled while there is text to delete', async () => {
      const seen: KeySeen = [];
      const onChange = vi.fn();
      const user = setupUser();
      render(
        <Combobox
          aria-label="Models"
          options={MODELS}
          multiple
          value={['gpt-4o']}
          onChange={onChange}
          onKeyDown={recordKeys(seen)}
        />,
      );
      await user.type(input(), 'g');
      await user.keyboard('{Backspace}');
      expect(onChange).not.toHaveBeenCalled();
      expect(input().value).toBe('');
      expect(seen).toEqual([
        ['g', false],
        ['Backspace', false],
      ]);
    });

    it("doesn't focus, open or call onFocus on a disabled input", async () => {
      const onFocus = vi.fn();
      const onKeyDown = vi.fn();
      const user = setupUser();
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          disabled
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />,
      );
      await user.click(input());
      await user.keyboard('a');
      expect(onFocus).not.toHaveBeenCalled();
      expect(onKeyDown).not.toHaveBeenCalled();
      expect(document.activeElement).not.toBe(input());
      expect(input().getAttribute('aria-expanded')).toBe('false');
    });

    it('passes other event handlers through to the input', async () => {
      const onClick = vi.fn();
      const onKeyUp = vi.fn();
      const onInput = vi.fn();
      const onChange = vi.fn();
      const onInputChange = vi.fn();
      const user = setupUser();
      render(
        <Combobox
          aria-label="Model"
          options={MODELS}
          onChange={onChange}
          onInputChange={onInputChange}
          onClick={onClick}
          onKeyUp={onKeyUp}
          onInput={onInput}
        />,
      );
      await user.click(input());
      await user.type(input(), 'g');
      expect(onClick).toHaveBeenCalled();
      expect(onClick.mock.calls[0][0].target).toBe(input());
      expect(onKeyUp).toHaveBeenCalled();
      expect(onInput).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('g');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('multiple mode', () => {
    it('leaves pass-through attributes off the chip group', () => {
      render(
        <Combobox
          aria-label="Models"
          options={MODELS}
          multiple
          value={['gpt-4o']}
          data-testid="tags"
          aria-describedby="help"
        />,
      );
      const group = document.querySelector('[role="toolbar"]')!;
      expect(group).not.toBeNull();
      expect(group.hasAttribute('data-testid')).toBe(false);
      expect(group.hasAttribute('aria-describedby')).toBe(false);
    });

    it('keeps pass-through attributes as chips are added and removed', async () => {
      const user = setupUser();
      render(
        <Combobox
          aria-label="Models"
          options={MODELS}
          multiple
          defaultValue={[]}
          data-testid="tags"
          aria-describedby="help"
        />,
      );
      await user.click(input());
      await user.keyboard('{Enter}');
      expect(chipLabels()).toEqual(['gpt-4o']);
      expect(input().getAttribute('data-testid')).toBe('tags');
      expect(input().getAttribute('aria-describedby')).toBe('help');
      await user.keyboard('{Backspace}');
      expect(chipLabels()).toEqual([]);
      expect(input().getAttribute('data-testid')).toBe('tags');
    });
  });
});
