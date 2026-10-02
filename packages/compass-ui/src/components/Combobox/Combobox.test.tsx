import { describe, expect, it, vi } from 'vitest';
import {
  focus,
  getByRole,
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
