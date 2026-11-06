import { act } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { focus, getByRole, render } from '@/test-utils/render';
import Chip from './Chip';
import ChipGroup from './ChipGroup';
import type { ChipGroupProps } from './ChipGroup';

function setupUser() {
  const user = userEvent.setup();
  return {
    keyboard: (keys: string) => act(() => user.keyboard(keys)),
    tab: (options?: { shift?: boolean }) => act(() => user.tab(options)),
  };
}

const NAMES = ['Alice', 'Bob', 'Carol'];

function chip(name: string) {
  return getByRole('button', `${name}. Press Delete to remove.`);
}

const documentKeys: string[] = [];
const onDocumentKeyDown = (e: globalThis.KeyboardEvent) => {
  documentKeys.push(e.key);
};

beforeEach(() => {
  documentKeys.length = 0;
  document.addEventListener('keydown', onDocumentKeyDown);
});

afterEach(() => {
  document.removeEventListener('keydown', onDocumentKeyDown);
});

function renderInHost(ui: ReactElement) {
  const hostKeys: string[] = [];
  render(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- stands in for a host form or modal key listener
    <div onKeyDown={(e) => hostKeys.push(e.key)}>{ui}</div>,
  );
  return hostKeys;
}

describe('ChipGroup inside a host with key listeners', () => {
  function renderGroup(props: Partial<ChipGroupProps> = {}) {
    const onRemove = Object.fromEntries(NAMES.map((name) => [name, vi.fn()]));
    const hostKeys = renderInHost(
      <ChipGroup aria-label="Recipients" {...props}>
        {NAMES.map((name) => (
          <Chip key={name} onRemove={onRemove[name]}>
            {name}
          </Chip>
        ))}
      </ChipGroup>,
    );
    return { hostKeys, onRemove };
  }

  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
    ['Delete', '{Delete}'],
    ['Backspace', '{Backspace}'],
  ])('keeps %s that removes a chip from reaching the host', async (_, keys) => {
    const user = setupUser();
    const { hostKeys, onRemove } = renderGroup();
    focus(chip('Bob'));
    await user.keyboard(keys);
    expect(onRemove.Bob).toHaveBeenCalledTimes(1);
    expect(onRemove.Alice).not.toHaveBeenCalled();
    expect(onRemove.Carol).not.toHaveBeenCalled();
    expect(hostKeys).toEqual([]);
    expect(documentKeys).toEqual([]);
  });

  it('keeps arrow, Home and End keys that move between chips from reaching the host', async () => {
    const user = setupUser();
    const { hostKeys } = renderGroup();
    focus(chip('Alice'));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(chip('Bob'));
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(chip('Carol'));
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(chip('Bob'));
    await user.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(chip('Alice'));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(chip('Carol'));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(chip('Carol'));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(chip('Alice'));
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(chip('Alice'));
    expect(hostKeys).toEqual([]);
    expect(documentKeys).toEqual([]);
  });

  it('lets Escape and Tab reach the host', async () => {
    const user = setupUser();
    const { hostKeys } = renderGroup();
    focus(chip('Alice'));
    await user.keyboard('{Escape}');
    await user.tab();
    expect(hostKeys).toEqual(['Escape', 'Tab']);
    expect(documentKeys).toEqual(['Escape', 'Tab']);
  });

  it('lets Enter reach the host when onKeyDown prevents it', async () => {
    const user = setupUser();
    const { hostKeys, onRemove } = renderGroup({
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') e.preventDefault();
      },
    });
    focus(chip('Alice'));
    await user.keyboard('{Enter}');
    expect(onRemove.Alice).not.toHaveBeenCalled();
    expect(hostKeys).toEqual(['Enter']);
    expect(documentKeys).toEqual(['Enter']);
  });

  it('lets Enter reach the host when disabled', async () => {
    const user = setupUser();
    const { hostKeys, onRemove } = renderGroup({ disabled: true });
    focus(chip('Alice'));
    await user.keyboard('{Enter}');
    expect(onRemove.Alice).not.toHaveBeenCalled();
    expect(hostKeys).toEqual(['Enter']);
    expect(documentKeys).toEqual(['Enter']);
  });

  it('lets Enter reach the host when a chip onKeyDown prevents it', async () => {
    const onRemove = vi.fn();
    const user = setupUser();
    const hostKeys = renderInHost(
      <ChipGroup aria-label="Recipients">
        <Chip
          onRemove={onRemove}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
        >
          Alice
        </Chip>
      </ChipGroup>,
    );
    focus(chip('Alice'));
    await user.keyboard('{Enter}');
    expect(onRemove).not.toHaveBeenCalled();
    expect(hostKeys).toEqual(['Enter']);
    expect(documentKeys).toEqual(['Enter']);
  });

  it('lets Enter and ArrowRight on an element that is not a chip reach the host', async () => {
    const onRemove = vi.fn();
    const onClick = vi.fn();
    const user = setupUser();
    const hostKeys = renderInHost(
      <ChipGroup aria-label="Recipients">
        <Chip onRemove={onRemove}>Alice</Chip>
        <button type="button" onClick={onClick}>
          Add
        </button>
      </ChipGroup>,
    );
    const add = getByRole('button', 'Add');
    focus(add);
    await user.keyboard('{Enter}');
    await user.keyboard('{ArrowRight}');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onRemove).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(add);
    expect(hostKeys).toEqual(['Enter', 'ArrowRight']);
    expect(documentKeys).toEqual(['Enter', 'ArrowRight']);
  });

  describe('with chips that cannot be removed', () => {
    function renderFilters() {
      const hostKeys = renderInHost(
        <ChipGroup aria-label="Filters">
          <Chip>Design</Chip>
          <Chip>Engineering</Chip>
        </ChipGroup>,
      );
      const [design, engineering] =
        document.querySelectorAll<HTMLElement>('[data-chip]');
      return { hostKeys, design, engineering };
    }

    it('keeps ArrowRight that moves between them from reaching the host', async () => {
      const user = setupUser();
      const { hostKeys, design, engineering } = renderFilters();
      focus(design);
      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(engineering);
      expect(hostKeys).toEqual([]);
      expect(documentKeys).toEqual([]);
    });

    it('lets Enter reach the host', async () => {
      const user = setupUser();
      const { hostKeys, design } = renderFilters();
      focus(design);
      await user.keyboard('{Enter}');
      expect(hostKeys).toEqual(['Enter']);
      expect(documentKeys).toEqual(['Enter']);
    });
  });
});

describe('standalone Chip inside a host with key listeners', () => {
  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
    ['Delete', '{Delete}'],
    ['Backspace', '{Backspace}'],
  ])(
    'keeps %s that removes the chip from reaching the host',
    async (_, keys) => {
      const onRemove = vi.fn();
      const user = setupUser();
      const hostKeys = renderInHost(<Chip onRemove={onRemove}>Alice</Chip>);
      focus(chip('Alice'));
      await user.keyboard(keys);
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(hostKeys).toEqual([]);
      expect(documentKeys).toEqual([]);
    },
  );

  it('lets Enter on a chip that cannot be removed reach the host', async () => {
    const user = setupUser();
    const hostKeys = renderInHost(<Chip tabIndex={0}>Design</Chip>);
    focus(document.querySelector('[data-chip]')!);
    await user.keyboard('{Enter}');
    expect(hostKeys).toEqual(['Enter']);
    expect(documentKeys).toEqual(['Enter']);
  });

  it('lets Enter reach the host when onKeyDown prevents it', async () => {
    const onRemove = vi.fn();
    const user = setupUser();
    const hostKeys = renderInHost(
      <Chip onRemove={onRemove} onKeyDown={(e) => e.preventDefault()}>
        Alice
      </Chip>,
    );
    focus(chip('Alice'));
    await user.keyboard('{Enter}');
    expect(onRemove).not.toHaveBeenCalled();
    expect(hostKeys).toEqual(['Enter']);
    expect(documentKeys).toEqual(['Enter']);
  });
});
