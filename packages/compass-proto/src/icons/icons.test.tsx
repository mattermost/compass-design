import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import BullseyeArrowIcon from './BullseyeArrowIcon';
import ClipboardTextOutlineIcon from './ClipboardTextOutlineIcon';
import MessageProcessingOutlineIcon from './MessageProcessingOutlineIcon';
import NoteTextOutlineIcon from './NoteTextOutlineIcon';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLElement | undefined;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

describe.each([
  ['BullseyeArrowIcon', BullseyeArrowIcon],
  ['ClipboardTextOutlineIcon', ClipboardTextOutlineIcon],
  ['MessageProcessingOutlineIcon', MessageProcessingOutlineIcon],
  ['NoteTextOutlineIcon', NoteTextOutlineIcon],
])('%s', (_name, Icon) => {
  function render(props: React.ComponentProps<typeof Icon> = {}) {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root!.render(<Icon {...props} />));
    return container.querySelector('svg')!;
  }

  it('matches the compass-icons API: size, color, pass-through', () => {
    const svg = render({ size: 20, color: 'red', 'aria-hidden': true });
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('height')).toBe('20');
    expect(svg.getAttribute('fill')).toBe('red');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('defaults to 1em and currentColor', () => {
    const svg = render();
    expect(svg.getAttribute('width')).toBe('1em');
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.querySelector('path')!.getAttribute('d')).toBeTruthy();
  });
});
