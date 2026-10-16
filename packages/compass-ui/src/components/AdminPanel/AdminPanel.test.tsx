import { describe, expect, it } from 'vitest';
import { getByRole, render } from '@/test-utils/render';
import AdminPanel from './AdminPanel';

function bodyEl(container: HTMLElement) {
  return container.querySelector('[class*="admin-panel__body"]');
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
