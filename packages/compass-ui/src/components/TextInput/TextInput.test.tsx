import { describe, expect, it, vi } from 'vitest';
import {
  click,
  focus,
  getByRole,
  keyDown,
  queryAllByRole,
  render,
} from '@/test-utils/render';
import Icon from '@/components/Icon/Icon';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import Button from '@/components/Button/Button';
import TextInput from './TextInput';

describe('TextInput message', () => {
  it('error tone sets aria-invalid and role=alert', () => {
    const { container } = render(
      <TextInput id="name" label="Name" message="Required" />,
    );
    const input = container.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(getByRole('alert').textContent).toBe('Required');
    expect(getByRole('alert').id).toBe('name-message');
  });

  it('info tone does not set aria-invalid or role=alert', () => {
    const { container } = render(
      <TextInput
        id="pw"
        label="Password"
        message="Use 8 or more characters."
        messageTone="info"
      />,
    );
    const input = container.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(queryAllByRole('alert')).toHaveLength(0);
    expect(container.querySelector('#pw-message')?.textContent).toContain(
      'Use 8 or more characters.',
    );
  });

  it('invalid alone still works with no message', () => {
    const { container } = render(<TextInput label="Name" invalid />);
    expect(container.querySelector('input')!.getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(queryAllByRole('alert')).toHaveLength(0);
  });

  it('aria-describedby includes message id then counter id', () => {
    const { container } = render(
      <TextInput
        id="bio"
        label="Bio"
        message="Too long"
        maxLength={10}
        showCharacterCount
        defaultValue="hello"
        aria-describedby="hint"
      />,
    );
    expect(
      container.querySelector('input')!.getAttribute('aria-describedby'),
    ).toBe('hint bio-message bio-counter');
  });

  it('renders message and counter in one footer row', () => {
    const { container } = render(
      <TextInput
        id="bio"
        label="Bio"
        message="Too long"
        maxLength={10}
        showCharacterCount
        defaultValue="hello"
      />,
    );
    const footer = container.querySelector('[class*="text-input__footer"]')!;
    expect(footer.contains(container.querySelector('#bio-message'))).toBe(true);
    expect(footer.contains(container.querySelector('#bio-counter'))).toBe(true);
  });
});

describe('TextInput clearable', () => {
  it('hides clear when clearable is false or empty', () => {
    render(<TextInput label="Q" defaultValue="abc" />);
    expect(queryAllByRole('button', 'Clear')).toHaveLength(0);

    render(<TextInput label="Q" clearable value="" onChange={() => {}} />);
    expect(queryAllByRole('button', 'Clear')).toHaveLength(0);

    render(<TextInput label="Q" clearable defaultValue="abc" disabled />);
    expect(queryAllByRole('button', 'Clear')).toHaveLength(0);
  });

  it('Escape clears when clearable and focuses again after onClear', () => {
    const onClear = vi.fn();
    const { container } = render(
      <TextInput label="Q" clearable defaultValue="abc" onClear={onClear} />,
    );
    const input = container.querySelector('input')!;
    focus(input);
    keyDown(input, 'Escape');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
  });

  it('built-in clear empties uncontrolled value', () => {
    const { container } = render(
      <TextInput label="Q" clearable defaultValue="abc" />,
    );
    click(getByRole('button', 'Clear'));
    expect(container.querySelector('input')!.value).toBe('');
    expect(queryAllByRole('button', 'Clear')).toHaveLength(0);
  });

  it('shows clear after trailingIcon', () => {
    const { container } = render(
      <TextInput
        label="Q"
        clearable
        defaultValue="abc"
        trailingIcon={<Icon glyph={<GlobeIcon />} />}
      />,
    );
    const trailing = container.querySelectorAll('[class*="__trailing-icon"]');
    expect(trailing.length).toBe(2);
    expect(
      trailing[1]!.querySelector('button[aria-label="Clear"]'),
    ).toBeTruthy();
  });
});

describe('TextInput trailingAction', () => {
  it('renders outside the bordered wrapper', () => {
    const { container } = render(
      <TextInput
        label="Code"
        message="Copied"
        messageTone="success"
        trailingAction={<Button>Copy</Button>}
      />,
    );
    const wrapper = container.querySelector('[class*="text-input__wrapper"]');
    const action = getByRole('button', 'Copy');
    expect(wrapper!.contains(action)).toBe(false);
    expect(
      container.querySelector('[class*="trailing-action"]')!.contains(action),
    ).toBe(true);
  });
});
