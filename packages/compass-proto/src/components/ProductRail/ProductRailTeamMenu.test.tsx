import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductRailTeamButton, ProductRailTeamMenu } from './index';

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
  return container;
}
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

const teams = [
  { id: 'a', name: 'Alpha', initials: 'Al' },
  { id: 'b', name: 'Beta', initials: 'Be', unread: true },
  { id: 'c', name: 'Gamma', initials: 'Ga', mentions: 3 },
];

describe('ProductRailTeamButton', () => {
  it('is a menu button named "Switch teams" that reflects open state', () => {
    const onClick = vi.fn();
    const c = render(
      <ProductRailTeamButton
        teams={teams}
        activeTeamId="a"
        open
        onClick={onClick}
      />,
    );
    const b = c.querySelector('button')!;
    expect(b.getAttribute('aria-label')).toBe(
      'Switch teams, Alpha, other teams have unread messages',
    );
    expect(b.getAttribute('aria-haspopup')).toBe('menu');
    expect(b.getAttribute('aria-expanded')).toBe('true');
    act(() => b.click());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('accepts a translated button label', () => {
    const c = render(
      <ProductRailTeamButton teams={teams} buttonLabel="Changer d’équipe" />,
    );
    expect(c.querySelector('button')!.getAttribute('aria-label')).toBe(
      'Changer d’équipe, Alpha, other teams have unread messages',
    );
  });

  it('names the current team and omits the unread phrase when nothing is unread', () => {
    const c = render(
      <ProductRailTeamButton
        teams={[
          { id: 'a', name: 'Alpha' },
          { id: 'b', name: 'Beta' },
        ]}
        activeTeamId="b"
      />,
    );
    expect(c.querySelector('button')!.getAttribute('aria-label')).toBe(
      'Switch teams, Beta',
    );
  });

  it('renders nothing without teams', () => {
    const c = render(<ProductRailTeamButton teams={[]} />);
    expect(c.querySelector('button')).toBeNull();
  });
});

describe('ProductRailTeamMenu', () => {
  it('lists teams and reports the selected id', () => {
    const onSelectTeam = vi.fn();
    const c = render(
      <ProductRailTeamMenu
        teams={teams}
        activeTeamId="a"
        onSelectTeam={onSelectTeam}
      />,
    );
    const rows = Array.from(c.querySelectorAll('button'));
    expect(rows.map((r) => r.textContent)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Alpha'),
        expect.stringContaining('Beta'),
        expect.stringContaining('Gamma'),
      ]),
    );
    act(() => rows[1].click());
    expect(onSelectTeam).toHaveBeenCalledWith('b');
  });

  it('only shows the Show team sidebar row when a handler is given', () => {
    const none = render(<ProductRailTeamMenu teams={teams} />);
    expect(none.textContent).not.toContain('Show team sidebar');
    act(() => root?.unmount());
    const onShow = vi.fn();
    const c = render(
      <ProductRailTeamMenu
        teams={teams}
        onShowTeamSidebar={onShow}
        showTeamSidebarLabel="Show team sidebar"
      />,
    );
    const row = Array.from(c.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Show team sidebar'),
    )!;
    act(() => row.click());
    expect(onShow).toHaveBeenCalled();
  });

  it('renders nothing while a controlled `open` is false', () => {
    const c = render(<ProductRailTeamMenu teams={teams} open={false} />);
    expect(c.querySelector('[role="menu"]')).toBeNull();
  });

  it('renders a labeled menu when `open` is true', () => {
    const c = render(<ProductRailTeamMenu teams={teams} open />);
    expect(c.querySelector('[role="menu"]')?.getAttribute('aria-label')).toBe(
      'Teams',
    );
    expect(c.querySelectorAll('[role="menuitemradio"]')).toHaveLength(3);
  });

  it('marks the current team checked and speaks unread teams', () => {
    const c = render(
      <ProductRailTeamMenu
        teams={teams}
        activeTeamId="a"
        open
        unreadLabel="non lu"
      />,
    );
    const rows = Array.from(c.querySelectorAll('[role="menuitemradio"]'));
    expect(rows.map((r) => r.getAttribute('aria-checked'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(rows[1].textContent).toContain('non lu');
    expect(rows[0].textContent).not.toContain('non lu');
  });

  describe('keyboard', () => {
    const press = (el: Element, key: string) =>
      act(() => {
        el.dispatchEvent(
          new KeyboardEvent('keydown', {
            key,
            bubbles: true,
            cancelable: true,
          }),
        );
      });

    it('moves focus into the menu on the current team when opened', () => {
      const c = render(
        <ProductRailTeamMenu teams={teams} activeTeamId="b" open />,
      );
      const rows = Array.from(c.querySelectorAll('[role="menuitemradio"]'));
      expect(document.activeElement).toBe(rows[1]);
    });

    it('does not steal focus when `open` is not controlled', () => {
      render(<ProductRailTeamMenu teams={teams} activeTeamId="b" />);
      expect(document.activeElement).toBe(document.body);
    });

    it('arrow keys, Home and End move focus between rows', () => {
      const c = render(
        <ProductRailTeamMenu teams={teams} activeTeamId="a" open />,
      );
      const rows = Array.from(
        c.querySelectorAll<HTMLElement>('[role="menuitemradio"]'),
      );
      const menu = c.querySelector('[role="menu"]')!;
      expect(document.activeElement).toBe(rows[0]);
      press(rows[0], 'ArrowDown');
      expect(document.activeElement).toBe(rows[1]);
      press(rows[1], 'End');
      expect(document.activeElement).toBe(rows[2]);
      press(rows[2], 'ArrowDown');
      expect(document.activeElement).toBe(rows[0]);
      press(rows[0], 'ArrowUp');
      expect(document.activeElement).toBe(rows[2]);
      press(rows[2], 'Home');
      expect(document.activeElement).toBe(rows[0]);
      expect(menu).not.toBeNull();
    });

    it('Escape calls onClose, and is left alone when already handled', () => {
      const onClose = vi.fn();
      const c = render(
        <ProductRailTeamMenu
          teams={teams}
          activeTeamId="a"
          open
          onClose={onClose}
        />,
      );
      const row = c.querySelector('[role="menuitemradio"]')!;
      press(row, 'Escape');
      expect(onClose).toHaveBeenCalledTimes(1);
      row.addEventListener('keydown', (e) => e.preventDefault(), true);
      press(row, 'Escape');
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
