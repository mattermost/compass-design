import { describe, expect, it, vi } from 'vitest';
import { click, getByRole, queryAllByRole, render } from '@/test-utils/render';
import PasswordInput from './PasswordInput';

describe('PasswordInput message', () => {
  it('error tone sets aria-invalid and role=alert', () => {
    const { container } = render(
      <PasswordInput id="pw" label="Password" message="Required" />,
    );
    expect(container.querySelector('input')!.getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(getByRole('alert').id).toBe('pw-message');
    expect(
      container.querySelector('input')!.getAttribute('aria-describedby'),
    ).toBe('pw-message');
  });

  it('info tone does not set aria-invalid or alert', () => {
    const { container } = render(
      <PasswordInput
        id="pw"
        label="Password"
        message="Use 8 or more characters."
        messageTone="info"
      />,
    );
    expect(
      container.querySelector('input')!.getAttribute('aria-invalid'),
    ).toBeNull();
    expect(queryAllByRole('alert')).toHaveLength(0);
  });
});

describe('PasswordInput reveal', () => {
  it('starts hidden as type=password with Show password control', () => {
    const { container } = render(
      <PasswordInput label="Password" defaultValue="secret" />,
    );
    expect(container.querySelector('input')!.getAttribute('type')).toBe(
      'password',
    );
    expect(getByRole('button', 'Show password')).toBeTruthy();
  });

  it('toggles to text and Hide password on click', () => {
    const onRevealedChange = vi.fn();
    const { container } = render(
      <PasswordInput
        label="Password"
        defaultValue="secret"
        onRevealedChange={onRevealedChange}
      />,
    );
    click(getByRole('button', 'Show password'));
    expect(container.querySelector('input')!.getAttribute('type')).toBe('text');
    expect(getByRole('button', 'Hide password')).toBeTruthy();
    expect(onRevealedChange).toHaveBeenCalledWith(true);
  });

  it('honors label overrides and revealButtonProps', () => {
    const { container } = render(
      <PasswordInput
        label="Password"
        defaultValue="secret"
        showPasswordLabel="Reveal"
        hidePasswordLabel="Conceal"
        revealButtonProps={{ 'data-testid': 'pw-reveal' }}
      />,
    );
    const btn = container.querySelector(
      '[data-testid="pw-reveal"]',
    ) as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Reveal');
    click(btn);
    expect(btn.getAttribute('aria-label')).toBe('Conceal');
  });

  it('stays type=password when disabled even if revealed', () => {
    const { container } = render(
      <PasswordInput
        label="Password"
        defaultValue="secret"
        defaultRevealed
        disabled
      />,
    );
    expect(container.querySelector('input')!.getAttribute('type')).toBe(
      'password',
    );
    expect(
      (getByRole('button', 'Show password') as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('supports controlled revealed', () => {
    const onRevealedChange = vi.fn();
    const { container, rerender } = render(
      <PasswordInput
        label="Password"
        defaultValue="secret"
        revealed={false}
        onRevealedChange={onRevealedChange}
      />,
    );
    click(getByRole('button', 'Show password'));
    expect(onRevealedChange).toHaveBeenCalledWith(true);
    expect(container.querySelector('input')!.getAttribute('type')).toBe(
      'password',
    );
    rerender(
      <PasswordInput
        label="Password"
        defaultValue="secret"
        revealed
        onRevealedChange={onRevealedChange}
      />,
    );
    expect(container.querySelector('input')!.getAttribute('type')).toBe('text');
    expect(getByRole('button', 'Hide password')).toBeTruthy();
  });

  it('omits the reveal control when revealable is false', () => {
    const { container } = render(
      <PasswordInput
        label="Password"
        defaultValue="secret"
        defaultRevealed
        revealable={false}
      />,
    );
    expect(container.querySelector('input')!.getAttribute('type')).toBe(
      'password',
    );
    expect(container.querySelector('button')).toBeNull();
  });

  it('forwards ref to the input', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<PasswordInput ref={ref} label="Password" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
