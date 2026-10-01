import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import ActionButton from './ActionButton/ActionButton';
import Button from './Button/Button';
import CardButton from './CardButton/CardButton';
import Checkbox from './Checkbox/Checkbox';
import IconButton from './IconButton/IconButton';
import MenuItem from './MenuItem/MenuItem';
import Radio from './Radio/Radio';
import Switch from './Switch/Switch';

describe('button primitives forward refs to the <button>', () => {
  it.each([
    [
      'Button',
      (ref: React.Ref<HTMLButtonElement>) => <Button ref={ref}>Save</Button>,
    ],
    [
      'IconButton',
      (ref: React.Ref<HTMLButtonElement>) => (
        <IconButton ref={ref} icon={null} aria-label="Close" />
      ),
    ],
    [
      'ActionButton',
      (ref: React.Ref<HTMLButtonElement>) => (
        <ActionButton ref={ref} icon={null} label="Call" />
      ),
    ],
    [
      'CardButton',
      (ref: React.Ref<HTMLButtonElement>) => (
        <CardButton ref={ref} icon={null} title="Public" />
      ),
    ],
    [
      'MenuItem',
      (ref: React.Ref<HTMLButtonElement>) => (
        <MenuItem ref={ref} label="Edit" />
      ),
    ],
  ])('%s', (_name, renderWithRef) => {
    const ref = createRef<HTMLButtonElement>();
    render(renderWithRef(ref));
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });
});

describe('form primitives forward refs to the <input>', () => {
  it.each([
    [
      'Checkbox',
      'checkbox',
      (ref: React.Ref<HTMLInputElement>) => <Checkbox ref={ref}>A</Checkbox>,
    ],
    [
      'Radio',
      'radio',
      (ref: React.Ref<HTMLInputElement>) => <Radio ref={ref}>A</Radio>,
    ],
    [
      'Switch',
      'checkbox',
      (ref: React.Ref<HTMLInputElement>) => <Switch ref={ref}>A</Switch>,
    ],
  ])('%s', (_name, inputType, renderWithRef) => {
    const ref = createRef<HTMLInputElement>();
    render(renderWithRef(ref));
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe(inputType);
  });

  it('Checkbox keeps syncing indeterminate while exposing the ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} indeterminate />);
    expect(ref.current?.indeterminate).toBe(true);
  });

  it('supports callback refs', () => {
    const callback = vi.fn();
    render(<Switch ref={callback} />);
    expect(callback).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});

describe('displayName', () => {
  it.each([
    [Button, 'Button'],
    [IconButton, 'IconButton'],
    [ActionButton, 'ActionButton'],
    [CardButton, 'CardButton'],
    [MenuItem, 'MenuItem'],
    [Checkbox, 'Checkbox'],
    [Radio, 'Radio'],
    [Switch, 'Switch'],
  ])('%#', (component, name) => {
    expect(component.displayName).toBe(name);
  });
});

describe('Button keeps its existing rendering', () => {
  it('renders the ConfirmModal usage unchanged', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button
        emphasis="primary"
        destructive
        id="confirm"
        autoFocus
        onClick={onClick}
      >
        Delete
      </Button>,
    );
    const button = container.querySelector('button')!;
    expect(button.id).toBe('confirm');
    expect(button.type).toBe('button');
    expect(button.textContent).toBe('Delete');
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
