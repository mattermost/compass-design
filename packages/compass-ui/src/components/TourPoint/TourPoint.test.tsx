import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POPOVER_TRANSITION_MS } from '@/hooks/usePopoverTransition';
import { click, keyDown, render } from '@/test-utils/render';
import TourPoint from './TourPoint';
import styles from './TourPoint.module.scss';

const tourPointScss = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'TourPoint.module.scss'),
  'utf8',
);

function titleEl() {
  return document.querySelector('h2') as HTMLHeadingElement | null;
}

function root() {
  return document.querySelector(`.${styles['tour-point']}`) as HTMLElement | null;
}

function closeButton() {
  return document.querySelector(
    'button[aria-label="Close"]',
  ) as HTMLButtonElement | null;
}

function primaryButton(label = 'Next') {
  return Array.from(document.querySelectorAll('button')).find((b) =>
    b.textContent?.includes(label),
  ) as HTMLButtonElement | undefined;
}

function flushExit() {
  act(() => {
    vi.advanceTimersByTime(POPOVER_TRANSITION_MS + 1);
  });
}

describe('TourPoint title font', () => {
  let styleEl: HTMLStyleElement;

  beforeEach(() => {
    // Vitest does not inject module CSS into happy-dom; assert the cascade with
    // the same specificity the SCSS compiles to (`.title.title:is(h2)` = 0,2,1).
    const titleClass = styles['tour-point__title'];
    styleEl = document.createElement('style');
    styleEl.textContent = `
      :root { --font-family-body: "Open Sans", sans-serif; }
      .app__body h2 { font-family: Metropolis, sans-serif; }
      .${titleClass}.${titleClass}:is(h2) {
        font-family: var(--font-family-body);
      }
    `;
    document.head.appendChild(styleEl);
    document.body.classList.add('app__body');
  });

  afterEach(() => {
    styleEl.remove();
    document.body.classList.remove('app__body');
  });

  it('keeps var(--font-family-body) against ancestor .app__body h2 Metropolis', () => {
    expect(styles['tour-point__title']).toBeTruthy();
    expect(tourPointScss).toMatch(
      /&__title#\{&\}__title:is\(:global\(h2\)\)/,
    );
    render(
      <TourPoint title="Welcome" onClose={() => {}}>
        Body
      </TourPoint>,
    );

    const title = titleEl();
    expect(title).not.toBeNull();
    expect(title!.className).toContain(styles['tour-point__title']);
    const family = getComputedStyle(title!).fontFamily;
    expect(family.toLowerCase()).toContain('open sans');
    expect(family.toLowerCase()).not.toContain('metropolis');
  });
});

describe('TourPoint exit dismiss', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('calls onClose only after the exit duration', () => {
    const onClose = vi.fn();
    render(
      <TourPoint title="Tip" onClose={onClose}>
        Body
      </TourPoint>,
    );
    click(closeButton()!);
    expect(onClose).not.toHaveBeenCalled();
    expect(root()).not.toBeNull();
    flushExit();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(root()).toBeNull();
  });

  it('calls primaryAction.onClick only after the exit duration', () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(
      <TourPoint
        title="Tip"
        onClose={onClose}
        primaryAction={{ label: 'Next', onClick }}
      >
        Body
      </TourPoint>,
    );
    click(primaryButton()!);
    expect(onClick).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    flushExit();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(root()).toBeNull();
  });

  it('ignores a second dismiss while exiting', () => {
    const onClose = vi.fn();
    const onClick = vi.fn();
    render(
      <TourPoint
        title="Tip"
        onClose={onClose}
        primaryAction={{ label: 'Next', onClick }}
      >
        Body
      </TourPoint>,
    );
    click(closeButton()!);
    click(primaryButton()!);
    flushExit();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('TourPoint Escape', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('closes when Escape is pressed inside the card', () => {
    const onClose = vi.fn();
    render(
      <TourPoint title="Tip" onClose={onClose}>
        Body
      </TourPoint>,
    );
    const card = root()!;
    let ev!: KeyboardEvent;
    act(() => {
      ev = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      card.dispatchEvent(ev);
    });
    expect(ev.defaultPrevented).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    flushExit();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when Escape is pressed outside the card', () => {
    const onClose = vi.fn();
    render(
      <div>
        <button type="button" data-testid="outside">
          Outside
        </button>
        <TourPoint title="Tip" onClose={onClose}>
          Body
        </TourPoint>
      </div>,
    );
    keyDown(document.querySelector('[data-testid="outside"]')!, 'Escape');
    flushExit();
    expect(onClose).not.toHaveBeenCalled();
    expect(root()).not.toBeNull();
  });
});
