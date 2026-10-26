/* eslint-disable jsx-a11y/anchor-has-content -- asChild hosts replace empty anchor children with anatomy */
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import TileButton from './TileButton/TileButton';
import Button from './Button/Button';
import CardButton from './CardButton/CardButton';
import Checkbox from './Checkbox/Checkbox';
import Combobox from './Combobox/Combobox';
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
      'TileButton',
      (ref: React.Ref<HTMLButtonElement>) => (
        <TileButton ref={ref} icon={null} label="Call" />
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
    [
      'Combobox',
      'text',
      (ref: React.Ref<HTMLInputElement>) => (
        <Combobox ref={ref} aria-label="Model" options={[]} />
      ),
    ],
    [
      'Combobox multiple',
      'text',
      (ref: React.Ref<HTMLInputElement>) => (
        <Combobox
          ref={ref}
          aria-label="Models"
          multiple
          value={['a']}
          options={[{ value: 'a', label: 'A' }]}
        />
      ),
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

  it('Combobox supports callback refs and props follow the ref', () => {
    const callback = vi.fn();
    render(
      <Combobox
        ref={callback}
        aria-label="Model"
        options={[]}
        data-testid="model"
      />,
    );
    const node = callback.mock.calls[0][0] as HTMLInputElement;
    expect(node).toBeInstanceOf(HTMLInputElement);
    expect(node.getAttribute('role')).toBe('combobox');
    expect(node.getAttribute('data-testid')).toBe('model');
  });
});

describe('asChild forwards refs to the <a>', () => {
  it.each([
    [
      'Button',
      (ref: React.Ref<HTMLAnchorElement>) => (
        <Button asChild ref={ref}>
          <a href="/x">Save</a>
        </Button>
      ),
    ],
    [
      'IconButton',
      (ref: React.Ref<HTMLAnchorElement>) => (
        <IconButton asChild ref={ref} icon={null} aria-label="Close">
          <a href="/x" />
        </IconButton>
      ),
    ],
    [
      'TileButton',
      (ref: React.Ref<HTMLAnchorElement>) => (
        <TileButton asChild ref={ref} icon={null} label="Call">
          <a href="/x" />
        </TileButton>
      ),
    ],
  ])('%s', (_name, renderWithRef) => {
    const ref = createRef<HTMLAnchorElement>();
    render(renderWithRef(ref));
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });
});

describe('displayName', () => {
  it.each([
    [Button, 'Button'],
    [IconButton, 'IconButton'],
    [TileButton, 'TileButton'],
    [CardButton, 'CardButton'],
    [MenuItem, 'MenuItem'],
    [Checkbox, 'Checkbox'],
    [Radio, 'Radio'],
    [Switch, 'Switch'],
  ])('%#', (component, name) => {
    expect(component.displayName).toBe(name);
  });
});
