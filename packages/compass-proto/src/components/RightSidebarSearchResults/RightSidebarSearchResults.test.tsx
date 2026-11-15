import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RightSidebarSearchResults from './RightSidebarSearchResults';
import { splitSearchHighlight } from './splitSearchHighlight';
import type { SearchResultMessageData } from './SearchResultMessage';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const results: SearchResultMessageData[] = [
  {
    id: 'p1',
    avatarAlt: 'Aiko Tan',
    username: 'Aiko Tan',
    timestamp: 'Today at 9:48 AM',
    channelLabel: 'Design',
    teamLabel: 'Compass',
    body: 'Shipping the new Sidebar header today',
  },
  {
    id: 'p2',
    avatarAlt: 'Leonard Riley',
    username: 'Leonard Riley',
    timestamp: 'Yesterday',
    channelLabel: 'Town Square',
    body: 'Nothing to see',
    pinned: true,
  },
];

let root: Root | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  root = host = undefined;
});

function mount(ui: React.ReactElement) {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root!.render(ui));
  return host;
}

describe('splitSearchHighlight', () => {
  it('marks case-insensitive matches and keeps the original casing', () => {
    expect(splitSearchHighlight('The Sidebar sidebar', ['sidebar'])).toEqual([
      { text: 'The ', match: false },
      { text: 'Sidebar', match: true },
      { text: ' ', match: false },
      { text: 'sidebar', match: true },
    ]);
  });

  it('escapes regex characters and ignores blank terms', () => {
    expect(splitSearchHighlight('a (b) c', ['(b)', ' '])).toEqual([
      { text: 'a ', match: false },
      { text: '(b)', match: true },
      { text: ' c', match: false },
    ]);
  });

  it('returns the text untouched when there are no terms', () => {
    expect(splitSearchHighlight('plain', [])).toEqual([
      { text: 'plain', match: false },
    ]);
  });
});

describe('RightSidebarSearchResults', () => {
  it('renders one row per result with a count and highlighted terms', () => {
    const el = mount(
      <RightSidebarSearchResults results={results} terms={['sidebar']} />,
    );
    expect(el.querySelectorAll('li')).toHaveLength(2);
    expect(el.querySelector('[role="status"]')?.textContent).toBe('2 results');
    const marks = el.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0].textContent).toBe('Sidebar');
    expect(el.textContent).toContain('Compass');
  });

  it('calls onJump with the result and honors jumpLabel', () => {
    const onJump = vi.fn();
    const el = mount(
      <RightSidebarSearchResults
        results={results}
        onJump={onJump}
        jumpLabel="Go to message"
      />,
    );
    const buttons = Array.from(el.querySelectorAll('button')).filter(
      (b) => b.textContent === 'Go to message',
    );
    expect(buttons).toHaveLength(2);
    act(() => buttons[1].click());
    expect(onJump).toHaveBeenCalledWith(results[1]);
  });

  it('shows the Pinned + Saved row only for flagged results', () => {
    const el = mount(<RightSidebarSearchResults results={results} />);
    expect(el.querySelectorAll('[aria-label="Pinned and Saved"]')).toHaveLength(
      1,
    );
  });

  it('shows kind-specific empty copy and allows overrides', () => {
    const el = mount(<RightSidebarSearchResults results={[]} kind="saved" />);
    expect(el.textContent).toContain('No saved messages yet');
    expect(el.querySelector('li')).toBeNull();
    act(() => root!.unmount());
    host!.remove();
    const el2 = mount(
      <RightSidebarSearchResults results={[]} emptyTitle="Nothing here" />,
    );
    expect(el2.textContent).toContain('Nothing here');
  });

  it('singularizes the default count and accepts a custom countLabel', () => {
    const el = mount(<RightSidebarSearchResults results={[results[0]]} />);
    expect(el.querySelector('[role="status"]')?.textContent).toBe('1 result');
    act(() => root!.unmount());
    host!.remove();
    const el2 = mount(
      <RightSidebarSearchResults
        results={results}
        countLabel={(n) => `${n} hits`}
      />,
    );
    expect(el2.querySelector('[role="status"]')?.textContent).toBe('2 hits');
  });
});
