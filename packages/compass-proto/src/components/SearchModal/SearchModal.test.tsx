import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchModal } from '../../index';
import type { SearchModalData, SearchModalProps } from './index';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLElement | undefined;
function render(ui: React.ReactElement) {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root!.render(ui));
}
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  document.body.innerHTML = '';
});

const sofia = { id: 'sofia', name: 'Sofia Bauer', username: '@sofia' };
const marco = { id: 'marco', name: 'Marco Rinaldi', username: '@marco' };
const leonard = { id: 'leonard', name: 'Leonard Riley' };
const emma = { id: 'emma', name: 'Emma Novak' };

const data: SearchModalData = {
  unreadChannels: [
    { id: 'ux', name: 'ux-design', mentionCount: 3 },
    { id: 'sec', name: 'security', kind: 'private' },
  ],
  recentChannels: [
    { id: 'town', name: 'town-square' },
    { id: 'crit', name: 'design-crit', kind: 'private' },
  ],
  frequentPeople: [sofia, marco, leonard],
  recentPeople: [emma],
  recentFiles: [
    {
      id: 'f1',
      name: 'Brand_Guidelines.pdf',
      description: 'ux-design · Mon',
      kind: 'pdf',
    },
    { id: 'f2', name: 'Roadmap.docx', kind: 'word' },
  ],
  recentMessageSearches: [
    { id: 'm1', query: 'launch checklist' },
    { id: 'm2', query: 'from:sofia Figma' },
  ],
  recentFileSearches: [{ id: 'fs1', query: 'brand guidelines' }],
  messageModifiers: ['From:', 'In:', 'On:'],
  fileModifiers: ['From:', 'Ext:'],
  recentAgentSearches: [
    { id: 'ra1', query: 'When is the next launch window?' },
    { id: 'ra2', query: 'Who is on call today?' },
  ],
  agentSuggestions: [
    { id: 'as1', query: 'What problems have recent launches had?' },
    { id: 'as2', query: 'What messages are pending my feedback?' },
    { id: 'as3', query: 'How many channels am I in?' },
  ],
  agents: [
    { id: 'matty', name: 'Matty' },
    { id: 'code', name: 'Code' },
  ],
};

const input = () => document.querySelector('input')!;
const options = () => Array.from(document.querySelectorAll('[role="option"]'));
const headings = () =>
  Array.from(document.querySelectorAll('[role="group"]')).map(
    (g) => g.textContent ?? '',
  );
const tabs = () =>
  Array.from(document.querySelectorAll('[role="tab"], [role="radio"]'));
const mode = (label: string) =>
  tabs().find((t) => t.textContent === label) as HTMLElement;

function press(el: Element, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    el.dispatchEvent(event);
  });
  return event;
}

function type(text: string) {
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )!.set!;
  act(() => {
    setValue.call(input(), text);
    input().dispatchEvent(new Event('input', { bubbles: true }));
  });
}

/** Lets a closing menu finish its exit motion. */
const settle = () =>
  act(async () => {
    await new Promise((r) => setTimeout(r, 400));
  });

const open = (props: Partial<SearchModalProps> = {}) =>
  render(<SearchModal open onClose={() => {}} data={data} {...props} />);

describe('SearchModal shell', () => {
  it('is a dialog with a mode control, a combobox and a named listbox', () => {
    open();
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog).not.toBeNull();
    const box = document.querySelector('[role="listbox"]')!;
    expect(box.getAttribute('aria-label')).toBe('Search results');
    expect(input().getAttribute('role')).toBe('combobox');
    expect(input().getAttribute('aria-expanded')).toBe('true');
    expect(input().getAttribute('aria-controls')).toBe(box.id);
    expect(tabs().map((t) => t.textContent)).toEqual([
      'All',
      'Channels',
      'Messages',
      'Files',
      'People',
      'Agents',
    ]);
  });

  it('renders nothing while closed', () => {
    open({ open: false });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('names the dialog with the hidden title', () => {
    open({ labels: { title: 'Recherche' } });
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(
      document.getElementById(dialog.getAttribute('aria-labelledby')!)!
        .textContent,
    ).toBe('Recherche');
  });

  it('offers only the modes it is given and starts on initialMode', () => {
    open({ modes: ['messages', 'files'], initialMode: 'messages' });
    expect(tabs().map((t) => t.textContent)).toEqual(['Messages', 'Files']);
    expect(input().getAttribute('placeholder')).toBe('Search messages');
  });

  it('takes translated mode names, placeholders and headings', () => {
    open({
      initialMode: 'channels',
      labels: {
        modeLabels: { channels: 'Canaux' },
        placeholders: { channels: 'Chercher des canaux' },
        headings: { unreads: 'Non lus' },
      },
    });
    expect(mode('Canaux')).toBeTruthy();
    expect(input().getAttribute('placeholder')).toBe('Chercher des canaux');
    expect(headings()[0]).toContain('Non lus');
  });

  it('hangs from the anchor over a transparent scrim that still closes', () => {
    const anchor = document.createElement('div');
    anchor.getBoundingClientRect = () =>
      ({ top: 4, left: 400, width: 200, height: 28 }) as DOMRect;
    document.body.appendChild(anchor);
    Object.defineProperty(window, 'innerWidth', {
      value: 1200,
      configurable: true,
    });
    const onClose = vi.fn();
    open({ anchor, onClose });
    const scrim = document.querySelector('[role="dialog"]')!
      .parentElement as HTMLElement;
    expect(scrim.style.backgroundColor).toBe('transparent');
    expect(scrim.style.padding).toBe('12px 0px 0px 148px');
    act(() => scrim.click());
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('focus and reopening', () => {
  it('focuses the field on open by default', () => {
    open();
    expect(document.activeElement).toBe(input());
  });

  it('leaves page focus alone with manageFocus={false}', () => {
    const before = document.createElement('button');
    document.body.appendChild(before);
    before.focus();
    open({ manageFocus: false });
    expect(document.activeElement).toBe(before);
    // Tab is not trapped inside the dialog either.
    const tab = press(document.body, 'Tab');
    expect(tab.defaultPrevented).toBe(false);
  });

  it('starts fresh when it is closed and reopened before the exit finishes', () => {
    const props = { onClose: () => {}, data, initialMode: 'files' as const };
    render(<SearchModal open {...props} />);
    act(() => mode('Messages').click());
    type('half typed');
    act(() => root!.render(<SearchModal open={false} {...props} />));
    act(() => root!.render(<SearchModal open {...props} />));
    expect(input().value).toBe('');
    expect(input().getAttribute('placeholder')).toBe('Search files');
  });
});

describe('modes: before typing', () => {
  it('All: unread channels, frequent people, recent files and searches', () => {
    open();
    expect(headings().map((h) => h.split(/[A-Z][a-z]/)[0])).toBeTruthy();
    const text = document.body.textContent!;
    for (const s of [
      'ux-design',
      'Sofia Bauer',
      'Brand_Guidelines.pdf',
      'launch checklist',
    ]) {
      expect(text).toContain(s);
    }
    expect(text).not.toContain('town-square');
  });

  it('Channels: Unreads then Recent', () => {
    open({ initialMode: 'channels' });
    expect(headings()).toEqual([
      expect.stringContaining('Unreads'),
      expect.stringContaining('Recent'),
    ]);
    expect(options()).toHaveLength(4);
  });

  it('Messages: recent searches only, with modifier tips in the footer', () => {
    open({ initialMode: 'messages' });
    expect(headings()).toEqual([expect.stringContaining('Recent searches')]);
    expect(document.body.textContent).toContain('Tip: Try');
    expect(document.body.textContent).toContain('In:');
  });

  it('Files: recent searches then recently added files', () => {
    open({ initialMode: 'files' });
    expect(headings()).toEqual([
      expect.stringContaining('Recent searches'),
      expect.stringContaining('Recently added files'),
    ]);
  });

  it('People: most-chatted then recent; hides most-chatted under 3 people', () => {
    open({ initialMode: 'people' });
    expect(headings()[0]).toContain('People you chat with most');
    act(() => root!.unmount());
    container!.remove();
    open({
      initialMode: 'people',
      data: { ...data, frequentPeople: [sofia, marco] },
    });
    expect(headings()).toEqual([expect.stringContaining('Recent')]);
  });

  it('People: falls back to an alphabetical directory with no DM activity', () => {
    open({
      initialMode: 'people',
      data: { directory: [marco, emma, sofia] },
    });
    expect(options().map((o) => o.textContent)).toEqual([
      expect.stringContaining('Emma Novak'),
      expect.stringContaining('Marco Rinaldi'),
      expect.stringContaining('Sofia Bauer'),
    ]);
  });

  it('Agents: recent questions then suggestions, a footer note and an agent picker', () => {
    open({ initialMode: 'agents' });
    expect(headings()).toEqual([
      expect.stringContaining('Recent'),
      expect.stringContaining('Suggestions'),
    ]);
    expect(options()).toHaveLength(5);
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
    expect(input().getAttribute('placeholder')).toBe(
      'Search by topic or ask AI a question',
    );
    expect(document.body.textContent).toContain(
      'Agents searches only content you have access to',
    );
    expect(document.body.textContent).toContain('Matty');
  });

  it('Agents: with nothing to list the body is dropped', () => {
    open({
      initialMode: 'agents',
      data: { agents: data.agents },
    });
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(
      document.querySelector('[class*="search-modal--empty"]'),
    ).not.toBeNull();
  });
});

describe('modes: while typing', () => {
  it('All: narrows channels, files and people; empty state when nothing matches', () => {
    open();
    type('design');
    expect(document.body.textContent).toContain('ux-design');
    expect(document.body.textContent).toContain('design-crit');
    type('zzzz');
    expect(document.body.textContent).toContain('No results found');
    expect(options()).toHaveLength(0);
  });

  it('Channels: flattens into one list of matches', () => {
    open({ initialMode: 'channels' });
    type('crit');
    expect(headings()).toEqual([expect.stringContaining('Channels')]);
    expect(options()).toHaveLength(1);
  });

  it('Messages: only narrows recent searches, and an unmatched query is not "no results"', () => {
    open({ initialMode: 'messages' });
    type('launch');
    expect(options()).toHaveLength(1);
    type('nothing like it');
    expect(document.body.textContent).not.toContain('No results found');
    expect(document.body.textContent).toContain('Enter to search');
  });

  it('Messages: from: lists people and choosing one adds a chip and clears the field', () => {
    open({ initialMode: 'messages' });
    type('from:');
    expect(headings()).toEqual([expect.stringContaining('From')]);
    expect(options().length).toBeGreaterThan(0);
    type('from:mar');
    expect(options()).toHaveLength(1);
    act(() => (options()[0] as HTMLElement).click());
    expect(input().value).toBe('');
    expect(document.body.textContent).toContain('From: Marco Rinaldi');
    expect(document.body.textContent).toContain('Enter to search');
  });

  it('Messages: a modifier tip inserts it into the field', () => {
    open({ initialMode: 'messages' });
    const from = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent === 'From:',
    )!;
    act(() => from.click());
    expect(input().value).toBe('from:');
    expect(headings()).toEqual([expect.stringContaining('From')]);
  });

  it('Files: narrows searches and files', () => {
    open({ initialMode: 'files' });
    type('roadmap');
    expect(headings()).toEqual([expect.stringContaining('Files')]);
    expect(options()).toHaveLength(1);
  });

  it('People: one flat list of matches by name or username', () => {
    open({ initialMode: 'people' });
    type('@emm');
    expect(options()).toHaveLength(0);
    type('emma');
    expect(options()).toHaveLength(1);
  });
});

describe('switching modes', () => {
  it('swaps the content, the placeholder and the footer, and clears the field', () => {
    const onModeChange = vi.fn();
    open({ onModeChange });
    type('design');
    act(() => mode('Files').click());
    expect(input().value).toBe('');
    expect(input().getAttribute('placeholder')).toBe('Search files');
    expect(headings()[0]).toContain('Recent searches');
    expect(onModeChange).toHaveBeenCalledWith('files');
    act(() => mode('People').click());
    expect(document.body.textContent).toContain('Use ⌘-Shift-K to');
    act(() => mode('Channels').click());
    expect(document.body.textContent).toContain('Browse channels');
  });

  it('keeps focus in the field', () => {
    open();
    act(() => mode('Messages').click());
    expect(document.activeElement).toBe(input());
  });
});

describe('mode switch animation', () => {
  const content = () =>
    document.querySelector('[class*="search-modal__content"]')!;

  it('does not animate on first open', () => {
    open();
    expect(content().className).not.toMatch(/enter-(forward|back)/);
  });

  it('slides in from the right for a later mode and from the left for an earlier one', () => {
    open();
    act(() => mode('Files').click());
    expect(content().className).toMatch(/enter-forward/);
    act(() => mode('Channels').click());
    expect(content().className).toMatch(/enter-back/);
    expect(content().className).not.toMatch(/enter-forward/);
  });

  it('remounts the content on a switch so the animation replays', () => {
    open();
    const before = content();
    act(() => mode('Messages').click());
    expect(content()).not.toBe(before);
  });
});

describe('keyboard and selection', () => {
  it('Channels: the first row is highlighted and Enter opens it', () => {
    const onSelect = vi.fn();
    open({ initialMode: 'channels', onSelect });
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[0].id);
    press(input(), 'ArrowDown');
    press(input(), 'Enter');
    expect(onSelect).toHaveBeenCalledWith({
      kind: 'channel',
      item: data.unreadChannels![1],
    });
  });

  it('People: Enter on a typed query opens the top match', () => {
    const onSelect = vi.fn();
    open({ initialMode: 'people', onSelect });
    type('leon');
    press(input(), 'Enter');
    expect(onSelect).toHaveBeenCalledWith({ kind: 'person', item: leonard });
  });

  it('Messages: no row is highlighted until an arrow key; Enter searches', () => {
    const onSubmit = vi.fn();
    const onSelect = vi.fn();
    open({ initialMode: 'messages', onSubmit, onSelect });
    expect(
      options().every((o) => o.getAttribute('aria-selected') !== 'true'),
    ).toBe(true);
    type('design');
    const event = press(input(), 'Enter');
    expect(event.defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({
      mode: 'messages',
      query: 'design',
      chips: [],
      agentId: undefined,
    });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('Messages: searches with chips only, and ignores an empty field', () => {
    const onSubmit = vi.fn();
    open({ initialMode: 'messages', onSubmit });
    press(input(), 'Enter');
    expect(onSubmit).not.toHaveBeenCalled();
    type('from:sof');
    act(() => (options()[0] as HTMLElement).click());
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ chips: ['From: Sofia Bauer'], query: '' }),
    );
  });

  it('Messages: first ArrowUp highlights the last row; arrows with no rows keep Enter searching', () => {
    const onSubmit = vi.fn();
    open({ initialMode: 'messages', onSubmit });
    press(input(), 'ArrowUp');
    const all = options();
    expect(input().getAttribute('aria-activedescendant')).toBe(
      all[all.length - 1].id,
    );
    type('from:zzzz');
    press(input(), 'ArrowDown');
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('Messages: a chosen recent search is reported', () => {
    const onSelect = vi.fn();
    open({ initialMode: 'messages', onSelect });
    act(() => (options()[1] as HTMLElement).click());
    expect(onSelect).toHaveBeenCalledWith({
      kind: 'recent',
      mode: 'messages',
      item: data.recentMessageSearches![1],
    });
  });

  it('removes a recent search from its control without selecting it, and with Shift+Delete', () => {
    const onSelect = vi.fn();
    const onRemoveRecent = vi.fn();
    open({ initialMode: 'messages', onSelect, onRemoveRecent });
    act(() =>
      (document.querySelector('[data-search-remove]') as HTMLElement).click(),
    );
    expect(onRemoveRecent).toHaveBeenCalledWith(
      'messages',
      data.recentMessageSearches![0],
    );
    expect(onSelect).not.toHaveBeenCalled();
    press(input(), 'Delete', { shiftKey: true });
    expect(onRemoveRecent).toHaveBeenCalledTimes(1); // nothing highlighted yet
    press(input(), 'ArrowDown');
    press(input(), 'Delete');
    expect(onRemoveRecent).toHaveBeenCalledTimes(1);
    press(input(), 'Delete', { shiftKey: true });
    expect(onRemoveRecent).toHaveBeenCalledTimes(2);
  });

  it('closes on Escape and prevents the default', () => {
    const onClose = vi.fn();
    open({ onClose });
    const event = press(input(), 'Escape');
    expect(event.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Agents: Enter sends the query with the chosen agent', () => {
    const onSubmit = vi.fn();
    open({ initialMode: 'agents', onSubmit });
    press(input(), 'Enter');
    expect(onSubmit).not.toHaveBeenCalled();
    type('what shipped?');
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalledWith({
      mode: 'agents',
      query: 'what shipped?',
      chips: [],
      agentId: 'matty',
    });
  });
});

describe('footer controls', () => {
  it('Agents: the picker lists agents and choosing one changes the target', async () => {
    const onSubmit = vi.fn();
    open({ initialMode: 'agents', onSubmit });
    const picker = document.querySelector(
      '[aria-haspopup="menu"]',
    ) as HTMLElement;
    expect(picker.getAttribute('aria-expanded')).toBe('false');
    act(() => picker.click());
    expect(picker.getAttribute('aria-expanded')).toBe('true');
    const menu = document.querySelector('[role="menu"]')!;
    expect(menu.getAttribute('aria-label')).toBe('Choose an Agent');
    const arjun = Array.from(menu.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Code'),
    ) as HTMLElement;
    act(() => arjun.click());
    await settle();
    expect(document.querySelector('[role="menu"]')).toBeNull();
    type('hello');
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ agentId: 'code' }),
    );
  });

  it('Escape in the picker closes only the menu and returns focus to it', async () => {
    const onClose = vi.fn();
    open({ initialMode: 'agents', onClose });
    act(() =>
      (document.querySelector('[aria-haspopup="menu"]') as HTMLElement).click(),
    );
    const menu = document.querySelector('[role="menu"]')!.parentElement!;
    press(menu, 'Escape');
    await settle();
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(
      document.querySelector('[aria-haspopup="menu"]'),
    );
  });

  it('Channels and People footers call their handlers', () => {
    const onBrowseChannels = vi.fn();
    const onBrowseTeammates = vi.fn();
    const onStartGroupMessage = vi.fn();
    open({
      initialMode: 'channels',
      onBrowseChannels,
      onBrowseTeammates,
      onStartGroupMessage,
    });
    act(() =>
      (
        Array.from(document.querySelectorAll('button')).find(
          (b) => b.textContent === 'Browse channels',
        ) as HTMLElement
      ).click(),
    );
    expect(onBrowseChannels).toHaveBeenCalled();
    act(() => mode('People').click());
    act(() =>
      (
        Array.from(document.querySelectorAll('button')).find(
          (b) => b.textContent === 'browse for teammates',
        ) as HTMLElement
      ).click(),
    );
    act(() =>
      (
        Array.from(document.querySelectorAll('button')).find(
          (b) => b.textContent === 'start a group message',
        ) as HTMLElement
      ).click(),
    );
    expect(onBrowseTeammates).toHaveBeenCalled();
    expect(onStartGroupMessage).toHaveBeenCalled();
  });
});

describe('review regressions', () => {
  it('Agents: submits the first agent when agents arrive after mount', () => {
    const onSubmit = vi.fn();
    render(
      <SearchModal
        open
        onClose={() => {}}
        initialMode="agents"
        onSubmit={onSubmit}
      />,
    );
    act(() =>
      root!.render(
        <SearchModal
          open
          onClose={() => {}}
          initialMode="agents"
          data={data}
          onSubmit={onSubmit}
        />,
      ),
    );
    type('hello');
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ agentId: 'matty' }),
    );
  });

  it('Messages: from: with no matching people still searches on Enter and shows no empty state', () => {
    const onSubmit = vi.fn();
    open({ initialMode: 'messages', onSubmit });
    type('from:zzzz');
    expect(document.body.textContent).not.toContain('No results found');
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('People rows keep away, do-not-disturb and offline badges', () => {
    open({
      initialMode: 'people',
      data: {
        recentPeople: [
          { id: 'a', name: 'Away Person', status: 'away' },
          { id: 'd', name: 'Busy Person', status: 'dnd' },
          { id: 'o', name: 'Offline Person', status: 'offline' },
        ],
      },
    });
    const badges = Array.from(document.querySelectorAll('[role="option"]')).map(
      (row) => row.querySelector('[class*="status"]') !== null,
    );
    expect(badges).toEqual([true, true, true]);
  });

  it('names a modifier chip with the translated remove label', () => {
    open({
      initialMode: 'messages',
      labels: { removeChipLabel: (label) => `Retirer ${label}` },
    });
    type('from:sof');
    act(() => (options()[0] as HTMLElement).click());
    expect(
      document.querySelector('[aria-label="Retirer From: Sofia Bauer"]'),
    ).not.toBeNull();
  });
});

describe('agents suggestions', () => {
  it('typing narrows to suggestions only and Enter opens the highlighted one', () => {
    const onSelect = vi.fn();
    open({ initialMode: 'agents', onSelect });
    type('what m');
    expect(headings()).toEqual([expect.stringContaining('Suggestions')]);
    expect(options()).toHaveLength(1);
    press(input(), 'Enter');
    expect(onSelect).toHaveBeenCalledWith({
      kind: 'suggestion',
      item: data.agentSuggestions![1],
      agentId: 'matty',
    });
  });

  it('a question with no matching suggestion is sent with Enter', () => {
    const onSubmit = vi.fn();
    open({ initialMode: 'agents', onSubmit });
    type('zzz unrelated');
    expect(options()).toHaveLength(0);
    expect(document.body.textContent).not.toContain('No results found');
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'agents',
        query: 'zzz unrelated',
        agentId: 'matty',
      }),
    );
  });

  it('a recent question is reported with its mode and can be removed', () => {
    const onSelect = vi.fn();
    const onRemoveRecent = vi.fn();
    open({ initialMode: 'agents', onSelect, onRemoveRecent });
    act(() => (options()[1] as HTMLElement).click());
    expect(onSelect).toHaveBeenCalledWith({
      kind: 'recent',
      mode: 'agents',
      item: data.recentAgentSearches![1],
      agentId: 'matty',
    });
    act(() =>
      (document.querySelector('[data-search-remove]') as HTMLElement).click(),
    );
    expect(onRemoveRecent).toHaveBeenCalledWith(
      'agents',
      data.recentAgentSearches![0],
    );
  });

  it('shows the sparkle icon on the Agents tab', () => {
    open();
    expect(mode('Agents').querySelector('svg')).not.toBeNull();
  });
});

describe('default agent', () => {
  const picker = () =>
    document.querySelector('[aria-haspopup="menu"]') as HTMLElement;

  it('selects defaultAgentId in the footer and submits it', () => {
    const onSubmit = vi.fn();
    open({ initialMode: 'agents', defaultAgentId: 'code', onSubmit });
    expect(picker().textContent).toContain('Code');
    type('hello');
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ agentId: 'code' }),
    );
  });

  it('falls back to the first agent when defaultAgentId is not offered', () => {
    open({ initialMode: 'agents', defaultAgentId: 'nobody' });
    expect(picker().textContent).toContain('Matty');
  });
});

describe('agent questions carry the selected agent', () => {
  it('includes the agent picked in the footer when a suggestion or recent question is chosen', () => {
    const onSelect = vi.fn();
    open({ initialMode: 'agents', onSelect });
    act(() =>
      (document.querySelector('[aria-haspopup="menu"]') as HTMLElement).click(),
    );
    act(() =>
      (
        Array.from(document.querySelectorAll('[role="menu"] button')).find(
          (b) => b.textContent?.includes('Code'),
        ) as HTMLElement
      ).click(),
    );
    act(() => (options()[3] as HTMLElement).click());
    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ kind: 'suggestion', agentId: 'code' }),
    );
    act(() => (options()[0] as HTMLElement).click());
    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({
        kind: 'recent',
        mode: 'agents',
        agentId: 'code',
      }),
    );
  });

  it('does not add an agent to other selections', () => {
    const onSelect = vi.fn();
    open({ initialMode: 'messages', onSelect });
    act(() => (options()[0] as HTMLElement).click());
    expect(onSelect.mock.calls[0][0]).not.toHaveProperty('agentId');
  });
});

describe('agent picker avatars', () => {
  it('shows a fallback avatar (initials) for agents without artwork', () => {
    open({
      initialMode: 'agents',
      data: {
        agents: [
          { id: 'code', name: 'Code' },
          { id: 'writer', name: 'Writer' },
        ],
      },
    });
    act(() =>
      (document.querySelector('[aria-haspopup="menu"]') as HTMLElement).click(),
    );
    const rows = Array.from(document.querySelectorAll('[role="menu"] button'));
    expect(rows.map((r) => r.textContent)).toEqual([
      expect.stringContaining('Code'),
      expect.stringContaining('Writer'),
    ]);
    expect(rows.every((r) => r.querySelector('img') === null)).toBe(true);
    expect(rows[1].textContent).toContain('W');
  });
});

describe('people cards', () => {
  it('lays out the most-chatted people as cards in the listbox, in keyboard order', () => {
    const onSelect = vi.fn();
    open({ initialMode: 'people', onSelect });
    const cards = Array.from(
      document.querySelectorAll('[role="listbox"] [class*="__cards"] button'),
    );
    expect(
      cards.map((c) => c.querySelector('[class*="card-name"]')!.textContent),
    ).toEqual(['Sofia Bauer', 'Marco Rinaldi', 'Leonard Riley']);
    expect(cards.every((c) => c.getAttribute('role') === 'option')).toBe(true);
    expect(cards[0].getAttribute('aria-selected')).toBe('true');
    press(input(), 'ArrowDown');
    expect(input().getAttribute('aria-activedescendant')).toBe(cards[1].id);
    press(input(), 'Enter');
    expect(onSelect).toHaveBeenCalledWith({ kind: 'person', item: marco });
    act(() => (cards[2] as HTMLElement).click());
    expect(onSelect).toHaveBeenLastCalledWith({
      kind: 'person',
      item: leonard,
    });
  });
});

describe('coderabbit review', () => {
  it('starts on an offered mode when initialMode is not offered', () => {
    open({ modes: ['messages', 'files'] });
    expect(input().getAttribute('placeholder')).toBe('Search messages');
  });

  it('Agents: typing shows no "No results found"', () => {
    open({ initialMode: 'agents' });
    type('hello');
    expect(document.body.textContent).not.toContain('No results found');
  });

  it('Agents: submits the displayed agent when the picked one disappears', () => {
    const onSubmit = vi.fn();
    render(
      <SearchModal
        open
        onClose={() => {}}
        initialMode="agents"
        data={data}
        onSubmit={onSubmit}
      />,
    );
    act(() =>
      (document.querySelector('[aria-haspopup="menu"]') as HTMLElement).click(),
    );
    act(() =>
      (
        Array.from(document.querySelectorAll('[role="menu"] button')).find(
          (b) => b.textContent?.includes('Code'),
        ) as HTMLElement
      ).click(),
    );
    act(() =>
      root!.render(
        <SearchModal
          open
          onClose={() => {}}
          initialMode="agents"
          data={{ ...data, agents: [data.agents![0]] }}
          onSubmit={onSubmit}
        />,
      ),
    );
    type('hi');
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ agentId: 'matty' }),
    );
  });

  it('Messages: returning to an earlier query does not restore the highlight', () => {
    const onSubmit = vi.fn();
    open({ initialMode: 'messages', onSubmit });
    type('launch');
    press(input(), 'ArrowDown');
    expect(input().getAttribute('aria-activedescendant')).not.toBeNull();
    type('la');
    type('launch');
    expect(input().getAttribute('aria-activedescendant')).toBeNull();
    press(input(), 'Enter');
    expect(onSubmit).toHaveBeenCalled();
  });
});

describe('team selector', () => {
  const teams = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
  ];

  it('is left out without teams', () => {
    open();
    expect(document.body.textContent).not.toContain('All teams');
  });

  it('shows All teams, opens a menu of teams and reports the choice', async () => {
    const onTeamChange = vi.fn();
    open({ teams, onTeamChange });
    const trigger = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent === 'All teams',
    ) as HTMLElement;
    act(() => trigger.click());
    const menu = document.querySelector('[role="menu"]')!;
    expect(
      Array.from(menu.querySelectorAll('[role="menuitemradio"]')).map(
        (i) => i.textContent,
      ),
    ).toEqual(['All teams', 'Alpha', 'Beta']);
    act(() =>
      (
        Array.from(menu.querySelectorAll('button')).find(
          (b) => b.textContent === 'Beta',
        ) as HTMLElement
      ).click(),
    );
    expect(onTeamChange).toHaveBeenCalledWith('b');
    await settle();
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(
      Array.from(document.querySelectorAll('button')).some(
        (b) => b.textContent === 'Beta',
      ),
    ).toBe(true);
  });
});
