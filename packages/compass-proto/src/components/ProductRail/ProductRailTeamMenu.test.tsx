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
    expect(b.getAttribute('aria-label')).toBe('Switch teams');
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
      'Changer d’équipe',
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
});
