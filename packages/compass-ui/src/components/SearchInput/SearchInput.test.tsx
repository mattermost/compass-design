import { describe, expect, it, vi } from 'vitest';
import {
  click,
  focus,
  getByRole,
  keyDown,
  queryAllByRole,
  render,
} from '@/test-utils/render';
import SearchInput from './SearchInput';

describe('SearchInput message', () => {
  it('error tone sets aria-invalid and role=alert', () => {
    const { container } = render(
      <SearchInput id="q" label="Search" message="No matches" />,
    );
    expect(container.querySelector('input')!.getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(getByRole('alert').id).toBe('q-message');
    expect(
      container.querySelector('input')!.getAttribute('aria-describedby'),
    ).toBe('q-message');
  });

  it('info tone does not set aria-invalid or alert', () => {
    const { container } = render(
      <SearchInput
        id="q"
        label="Search"
        message="Try another term"
        messageTone="info"
      />,
    );
    expect(
      container.querySelector('input')!.getAttribute('aria-invalid'),
    ).toBeNull();
    expect(queryAllByRole('alert')).toHaveLength(0);
  });
});

describe('SearchInput clear', () => {
  it('clears on Escape and keeps clear out of tab order by default', () => {
    const { container } = render(
      <SearchInput label="Search" defaultValue="abc" />,
    );
    const clear = getByRole('button', 'Clear search') as HTMLButtonElement;
    expect(clear.tabIndex).toBe(-1);

    const input = container.querySelector('input')!;
    focus(input);
    keyDown(input, 'Escape');
    expect(input.value).toBe('');
  });

  it('calls onClear and restores focus', () => {
    const onClear = vi.fn();
    const { container } = render(
      <SearchInput label="Search" defaultValue="abc" onClear={onClear} />,
    );
    click(getByRole('button', 'Clear search'));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(container.querySelector('input'));
  });
});
