import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { click, getByRole, render } from '@/test-utils/render';
import AdminPanel, { type AdminPanelExpandedState } from './AdminPanel';

function bodyEl(container: HTMLElement) {
  return container.querySelector('[class*="admin-panel__body"]');
}

function expandButton(container: HTMLElement) {
  return container.querySelector<HTMLButtonElement>('button[aria-expanded]')!;
}

function isExpanded(container: HTMLElement) {
  return expandButton(container).getAttribute('aria-expanded') === 'true';
}

describe('AdminPanel body', () => {
  it('renders the body when children are provided', () => {
    const { container } = render(
      <AdminPanel title="Section Title">Panel content</AdminPanel>,
    );
    const body = bodyEl(container);
    expect(body).not.toBeNull();
    expect(body?.textContent).toBe('Panel content');
  });

  it('does not render the body when children are omitted', () => {
    const { container } = render(<AdminPanel title="Section Title" />);
    expect(bodyEl(container)).toBeNull();
  });

  it('does not render the body when children are undefined', () => {
    const { container } = render(
      <AdminPanel title="Section Title" children={undefined} />,
    );
    expect(bodyEl(container)).toBeNull();
  });

  it('does not render the body when children are null', () => {
    const { container } = render(
      <AdminPanel title="Section Title">{null}</AdminPanel>,
    );
    expect(bodyEl(container)).toBeNull();
  });

  it('does not render the body when children are only omitted conditionals', () => {
    const { container } = render(
      <AdminPanel title="Section Title">
        {false}
        {null}
        {undefined}
      </AdminPanel>,
    );
    expect(bodyEl(container)).toBeNull();
  });

  it('still renders the header for a header-only panel', () => {
    const { container } = render(
      <AdminPanel
        title="System Scheme"
        subtitle="Manage the default permission scheme"
        showButton
        buttonLabel="Edit Scheme"
      />,
    );
    const title = container.querySelector('h2');
    expect(title?.textContent).toBe('System Scheme');
    expect(container.textContent).toContain(
      'Manage the default permission scheme',
    );
    expect(getByRole('button', 'Edit Scheme')).not.toBeNull();
    expect(bodyEl(container)).toBeNull();
  });

  it('renders a body-only panel without a header', () => {
    const { container } = render(<AdminPanel>Body content only</AdminPanel>);
    expect(container.querySelector('h2')).toBeNull();
    expect(bodyEl(container)?.textContent).toBe('Body content only');
    expect(
      container.querySelector('section')?.getAttribute('aria-labelledby'),
    ).toBeNull();
  });

  it('treats nullish, false, and empty-string titles as no header', () => {
    for (const title of [undefined, null, false, ''] as const) {
      const { container } = render(
        <AdminPanel title={title as never}>Body</AdminPanel>,
      );
      expect(container.querySelector('h2')).toBeNull();
      expect(bodyEl(container)?.textContent).toBe('Body');
    }
  });

  it('renders body and footer without a header', () => {
    const { container } = render(
      <AdminPanel footer={<div>Footer actions</div>}>Body content</AdminPanel>,
    );
    expect(container.querySelector('h2')).toBeNull();
    expect(bodyEl(container)?.textContent).toBe('Body content');
    expect(container.textContent).toContain('Footer actions');
  });

  it('does not render the collapse wrapper or body when expandable and empty', () => {
    const { container } = render(
      <AdminPanel
        title="Section Title"
        expandable
        defaultExpandedState="expanded"
      />,
    );
    expect(
      container.querySelector('[class*="admin-panel__collapse"]'),
    ).toBeNull();
    expect(bodyEl(container)).toBeNull();
  });

  it('renders a footer without a body', () => {
    const { container } = render(
      <AdminPanel title="Section Title" footer={<div>Footer actions</div>} />,
    );
    expect(bodyEl(container)).toBeNull();
    expect(container.textContent).toContain('Footer actions');
  });

  it('collapses footer with the body when expandable', () => {
    const { container } = render(
      <AdminPanel
        title="Section Title"
        expandable
        defaultExpandedState="expanded"
        footer={<div>Footer actions</div>}
      >
        Panel content
      </AdminPanel>,
    );
    expect(
      container.querySelector('[class*="admin-panel__collapse"]'),
    ).not.toBeNull();
    expect(bodyEl(container)?.textContent).toBe('Panel content');
    expect(container.textContent).toContain('Footer actions');
  });

  it('marks the collapse region inert and aria-hidden when collapsed', () => {
    const { container } = render(
      <AdminPanel
        title="Section Title"
        expandable
        defaultExpandedState="collapsed"
      >
        <button type="button">Hidden action</button>
      </AdminPanel>,
    );
    const collapse = container.querySelector(
      '[class*="admin-panel__collapse"]',
    );
    expect(collapse).not.toBeNull();
    expect(collapse?.getAttribute('aria-hidden')).toBe('true');
    expect(collapse?.hasAttribute('inert')).toBe(true);
  });

  it('clears inert and aria-hidden when expanded', () => {
    const { container } = render(
      <AdminPanel
        title="Section Title"
        expandable
        defaultExpandedState="expanded"
      >
        <button type="button">Visible action</button>
      </AdminPanel>,
    );
    const collapse = container.querySelector(
      '[class*="admin-panel__collapse"]',
    );
    expect(collapse?.getAttribute('aria-hidden')).toBe('false');
    expect(collapse?.hasAttribute('inert')).toBe(false);
  });
});

describe('AdminPanel header click-to-toggle', () => {
  it('toggles when the title, subtitle or header padding is clicked', () => {
    const onExpandedStateChange = vi.fn();
    const { container } = render(
      <AdminPanel
        title="Section Title"
        subtitle="Section sub-title"
        expandable
        onExpandedStateChange={onExpandedStateChange}
      >
        Body
      </AdminPanel>,
    );
    expect(isExpanded(container)).toBe(false);

    click(container.querySelector('h2')!);
    expect(isExpanded(container)).toBe(true);

    click(container.querySelector('p')!);
    expect(isExpanded(container)).toBe(false);

    click(container.querySelector('header')!);
    expect(isExpanded(container)).toBe(true);

    expect(onExpandedStateChange.mock.calls).toEqual([
      ['expanded'],
      ['collapsed'],
      ['expanded'],
    ]);
  });

  it('toggles exactly once when the expand button is clicked', () => {
    const onExpandedStateChange = vi.fn();
    const { container } = render(
      <AdminPanel
        title="Section Title"
        expandable
        onExpandedStateChange={onExpandedStateChange}
      >
        Body
      </AdminPanel>,
    );
    click(expandButton(container));
    expect(onExpandedStateChange).toHaveBeenCalledTimes(1);
    expect(isExpanded(container)).toBe(true);
  });

  it('does not toggle from the header Switch, Button or headerActions', () => {
    const onExpandedStateChange = vi.fn();
    const onButtonClick = vi.fn();
    const onSwitchChange = vi.fn();
    const { container } = render(
      <AdminPanel
        title="Section Title"
        expandable
        onExpandedStateChange={onExpandedStateChange}
        showSwitch
        onSwitchChange={onSwitchChange}
        showButton
        buttonLabel="Edit"
        onButtonClick={onButtonClick}
        headerActions={
          <>
            <a href="#help">Help</a>
            <span data-testid="action-text">Static action text</span>
          </>
        }
      >
        Body
      </AdminPanel>,
    );

    click(container.querySelector('input[type="checkbox"]')!);
    click(getByRole('button', 'Edit'));
    click(container.querySelector('a[href="#help"]')!);
    click(container.querySelector('[data-testid="action-text"]')!);

    expect(onSwitchChange).toHaveBeenCalledTimes(1);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
    expect(onExpandedStateChange).not.toHaveBeenCalled();
    expect(isExpanded(container)).toBe(false);
  });

  it('does not toggle from interactive content inside the title', () => {
    const onExpandedStateChange = vi.fn();
    const { container } = render(
      <AdminPanel
        title={
          <>
            Section <a href="#docs">docs</a>
          </>
        }
        subtitle={
          <>
            <button type="button">Learn more</button>
            <span role="button" tabIndex={0} data-testid="custom-trigger">
              More
            </span>
          </>
        }
        expandable
        onExpandedStateChange={onExpandedStateChange}
      >
        Body
      </AdminPanel>,
    );
    click(container.querySelector('a[href="#docs"]')!);
    click(getByRole('button', 'Learn more'));
    click(container.querySelector('[data-testid="custom-trigger"]')!);
    expect(onExpandedStateChange).not.toHaveBeenCalled();
    expect(isExpanded(container)).toBe(false);
  });

  it('skips clicks a descendant already handled with preventDefault', () => {
    const onExpandedStateChange = vi.fn();
    const { container } = render(
      <AdminPanel
        title={
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stands in for a host handler that claims the click
          <span data-testid="claimed" onClick={(e) => e.preventDefault()}>
            Section Title
          </span>
        }
        expandable
        onExpandedStateChange={onExpandedStateChange}
      >
        Body
      </AdminPanel>,
    );
    click(container.querySelector('[data-testid="claimed"]')!);
    expect(onExpandedStateChange).not.toHaveBeenCalled();
  });

  it('drives controlled expandedState through onExpandedStateChange', () => {
    function Controlled() {
      const [state, setState] = useState<AdminPanelExpandedState>('expanded');
      return (
        <AdminPanel
          title="Section Title"
          expandable
          expandedState={state}
          onExpandedStateChange={setState}
        >
          Body
        </AdminPanel>
      );
    }
    const { container } = render(<Controlled />);
    expect(isExpanded(container)).toBe(true);
    click(container.querySelector('h2')!);
    expect(isExpanded(container)).toBe(false);
    click(container.querySelector('h2')!);
    expect(isExpanded(container)).toBe(true);
  });

  it('does not change a controlled panel the host keeps fixed', () => {
    const onExpandedStateChange = vi.fn();
    const { container } = render(
      <AdminPanel
        title="Section Title"
        expandable
        expandedState="collapsed"
        onExpandedStateChange={onExpandedStateChange}
      >
        Body
      </AdminPanel>,
    );
    click(container.querySelector('h2')!);
    expect(onExpandedStateChange).toHaveBeenCalledWith('expanded');
    expect(isExpanded(container)).toBe(false);
  });

  it('still toggles when the panel sits inside a focusable ancestor', () => {
    const onExpandedStateChange = vi.fn();
    const { container } = render(
      <div tabIndex={-1}>
        <AdminPanel
          title="Section Title"
          expandable
          onExpandedStateChange={onExpandedStateChange}
        >
          Body
        </AdminPanel>
      </div>,
    );
    click(container.querySelector('h2')!);
    expect(onExpandedStateChange).toHaveBeenCalledWith('expanded');
    expect(isExpanded(container)).toBe(true);
  });

  it('does not toggle when not expandable', () => {
    const onExpandedStateChange = vi.fn();
    const { container } = render(
      <AdminPanel
        title="Section Title"
        subtitle="Section sub-title"
        onExpandedStateChange={onExpandedStateChange}
      >
        Body
      </AdminPanel>,
    );
    click(container.querySelector('h2')!);
    click(container.querySelector('header')!);
    expect(onExpandedStateChange).not.toHaveBeenCalled();
    expect(container.querySelector('button[aria-expanded]')).toBeNull();
    expect(bodyEl(container)).not.toBeNull();
  });
});
