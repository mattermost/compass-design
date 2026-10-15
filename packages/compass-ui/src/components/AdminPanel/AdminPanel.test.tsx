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
});
