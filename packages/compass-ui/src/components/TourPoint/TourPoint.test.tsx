import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { act, useState } from 'react';
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
  return document.querySelector(
    `.${styles['tour-point']}`,
  ) as HTMLElement | null;
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

describe('TourPoint stacking', () => {
  it('uses the popover z-index token on the root', () => {
    expect(tourPointScss).toMatch(
      /\.tour-point\s*\{[^}]*z-index:\s*var\(--z-popover,\s*1200\)/s,
    );
  });
});

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
    expect(tourPointScss).toMatch(/&__title#\{&\}__title:is\(:global\(h2\)\)/);
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
    function Host() {
      const [show, setShow] = useState(true);
      if (!show) return null;
      return (
        <TourPoint
          title="Tip"
          onClose={() => {
            onClose();
            setShow(false);
          }}
        >
          Body
        </TourPoint>
      );
    }
    render(<Host />);
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
    function Host() {
      const [show, setShow] = useState(true);
      if (!show) return null;
      return (
        <TourPoint
          title="Tip"
          onClose={onClose}
          primaryAction={{
            label: 'Next',
            onClick: () => {
              onClick();
              setShow(false);
            },
          }}
        >
          Body
        </TourPoint>
      );
    }
    render(<Host />);
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
    function Host() {
      const [show, setShow] = useState(true);
      if (!show) return null;
      return (
        <TourPoint
          title="Tip"
          onClose={() => {
            onClose();
            setShow(false);
          }}
          primaryAction={{ label: 'Next', onClick }}
        >
          Body
        </TourPoint>
      );
    }
    render(<Host />);
    click(closeButton()!);
    click(primaryButton()!);
    flushExit();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('reopens with updated props when primary advances a multi-step tour without remounting', () => {
    const onNext = vi.fn();
    function Host() {
      const [step, setStep] = useState(0);
      const titles = ['Step one', 'Step two'];
      return (
        <TourPoint
          title={titles[step]}
          progress={{ pages: 2, activePage: step + 1 }}
          primaryAction={{
            label: 'Next',
            onClick: () => {
              onNext();
              setStep((s) => s + 1);
            },
          }}
        >
          Body
        </TourPoint>
      );
    }
    render(<Host />);
    expect(titleEl()?.textContent).toBe('Step one');
    const next = primaryButton()!;
    act(() => {
      next.focus();
    });
    expect(document.activeElement).toBe(next);
    click(next);
    flushExit();
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(root()).not.toBeNull();
    expect(titleEl()?.textContent).toBe('Step two');
    expect(document.activeElement).toBe(primaryButton());
  });

  it('stays collapsed after Got it when the host keeps the instance', () => {
    const onGotIt = vi.fn();
    render(
      <TourPoint
        title="Tip"
        onClose={() => {}}
        primaryAction={{ label: 'Got it', onClick: onGotIt }}
      >
        Body
      </TourPoint>,
    );
    click(primaryButton('Got it')!);
    flushExit();
    expect(onGotIt).toHaveBeenCalledTimes(1);
    expect(titleEl()).toBeNull();
    expect(
      document.querySelector('button[aria-label="Open tip"]'),
    ).not.toBeNull();
  });

  it('stays collapsed after Done on the last step of a series', () => {
    const onDone = vi.fn();
    render(
      <TourPoint
        title="Last tip"
        onClose={() => {}}
        progress={{ pages: 3, activePage: 3 }}
        primaryAction={{ label: 'Done', onClick: onDone }}
      >
        Body
      </TourPoint>,
    );
    click(primaryButton('Done')!);
    flushExit();
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(titleEl()).toBeNull();
    expect(
      document.querySelector('button[aria-label="Open tip"]'),
    ).not.toBeNull();
  });

  it('restores focus into the tip after Next when open is controlled', () => {
    const onNext = vi.fn();
    function Host() {
      const [step, setStep] = useState(0);
      const [open, setOpen] = useState(true);
      const titles = ['Step one', 'Step two'];
      return (
        <TourPoint
          title={titles[step]}
          open={open}
          onOpenChange={setOpen}
          progress={{ pages: 2, activePage: step + 1 }}
          primaryAction={{
            label: 'Next',
            onClick: () => {
              onNext();
              setStep(1);
              setOpen(true);
            },
          }}
        >
          Body
        </TourPoint>
      );
    }
    render(<Host />);
    const next = primaryButton()!;
    act(() => {
      next.focus();
    });
    click(next);
    flushExit();
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(titleEl()?.textContent).toBe('Step two');
    expect(document.activeElement).toBe(primaryButton());
  });

  it('does not steal focus when it moved outside during exit', () => {
    function Host() {
      const [step, setStep] = useState(0);
      return (
        <div>
          <button type="button" data-testid="outside">
            Outside
          </button>
          <TourPoint
            title={step === 0 ? 'Step one' : 'Step two'}
            progress={{ pages: 2, activePage: step + 1 }}
            primaryAction={{
              label: 'Next',
              onClick: () => setStep(1),
            }}
          >
            Body
          </TourPoint>
        </div>
      );
    }
    render(<Host />);
    const next = primaryButton()!;
    act(() => {
      next.focus();
    });
    click(next);
    const outside = document.querySelector(
      '[data-testid="outside"]',
    ) as HTMLButtonElement;
    act(() => {
      outside.focus();
    });
    flushExit();
    expect(titleEl()?.textContent).toBe('Step two');
    expect(document.activeElement).toBe(outside);
  });

  it('hides pagination dots when progress.pages is 1', () => {
    render(
      <TourPoint
        title="Tip"
        progress={{ pages: 1, activePage: 1 }}
        primaryAction={{ label: 'Got it', onClick: () => {} }}
      >
        Body
      </TourPoint>,
    );
    expect(document.querySelector('[role="tablist"]')).toBeNull();
  });

  it('shows pagination dots when progress.pages is greater than 1', () => {
    render(
      <TourPoint
        title="Tip"
        progress={{ pages: 3, activePage: 1 }}
        primaryAction={{ label: 'Next', onClick: () => {} }}
      >
        Body
      </TourPoint>,
    );
    expect(document.querySelector('[role="tablist"]')).not.toBeNull();
  });

  it('does not steal focus on default-open mount', () => {
    render(
      <TourPoint
        title="Tip"
        primaryAction={{ label: 'Next', onClick: () => {} }}
      >
        Body
      </TourPoint>,
    );
    expect(titleEl()?.textContent).toBe('Tip');
    expect(document.activeElement).not.toBe(primaryButton());
    expect(document.activeElement).not.toBe(closeButton());
  });

  it('calls secondaryAction.onClick after the exit and reopens for the prior step', () => {
    const onPrev = vi.fn();
    function Host() {
      const [step, setStep] = useState(1);
      return (
        <TourPoint
          title={step === 0 ? 'Step one' : 'Step two'}
          secondaryAction={{
            label: 'Previous',
            onClick: () => {
              onPrev();
              setStep(0);
            },
          }}
          primaryAction={{ label: 'Next', onClick: () => {} }}
        >
          Body
        </TourPoint>
      );
    }
    render(<Host />);
    expect(titleEl()?.textContent).toBe('Step two');
    click(primaryButton('Previous')!);
    expect(onPrev).not.toHaveBeenCalled();
    flushExit();
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(titleEl()?.textContent).toBe('Step one');
  });

  it('does nothing when primaryAction has no onClick', () => {
    const onOpenChange = vi.fn();
    render(
      <TourPoint
        title="Tip"
        onOpenChange={onOpenChange}
        primaryAction={{ label: 'Next' }}
      >
        Body
      </TourPoint>,
    );
    click(primaryButton()!);
    flushExit();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(titleEl()?.textContent).toBe('Tip');
  });

  it('drops a pending dismiss when the host reopens before exit finishes', () => {
    const onClose = vi.fn();
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <div>
          <button
            type="button"
            data-testid="reopen"
            onClick={() => setOpen(true)}
          >
            Reopen
          </button>
          <TourPoint
            title="Tip"
            open={open}
            onOpenChange={setOpen}
            onClose={onClose}
          >
            Body
          </TourPoint>
        </div>
      );
    }
    render(<Host />);
    click(closeButton()!);
    click(document.querySelector('[data-testid="reopen"]')!);
    flushExit();
    expect(onClose).not.toHaveBeenCalled();
    expect(titleEl()?.textContent).toBe('Tip');
  });
});

describe('TourPoint closed pulsing dot', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function openDot() {
    return document.querySelector(
      'button[aria-label="Open tip"]',
    ) as HTMLButtonElement | null;
  }

  it('starts closed as a clickable pulsing dot when defaultOpen is false', () => {
    render(
      <TourPoint title="Welcome" defaultOpen={false}>
        Body
      </TourPoint>,
    );
    expect(titleEl()).toBeNull();
    expect(openDot()).not.toBeNull();
    click(openDot()!);
    expect(titleEl()?.textContent).toBe('Welcome');
    expect(openDot()).toBeNull();
  });

  it('collapses to the pulsing dot after close when the host keeps the instance', () => {
    const onClose = vi.fn();
    render(
      <TourPoint title="Tip" onClose={onClose} defaultOpen>
        Body
      </TourPoint>,
    );
    const close = closeButton()!;
    act(() => {
      close.focus();
    });
    click(close);
    flushExit();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(titleEl()).toBeNull();
    expect(openDot()).not.toBeNull();
    expect(document.activeElement).toBe(openDot());
  });

  it('moves focus into the card when opened from the pulsing dot', () => {
    render(
      <TourPoint
        title="Welcome"
        defaultOpen={false}
        primaryAction={{ label: 'Next', onClick: () => {} }}
      >
        Body
      </TourPoint>,
    );
    const dot = openDot()!;
    act(() => {
      dot.focus();
    });
    click(dot);
    expect(titleEl()?.textContent).toBe('Welcome');
    expect(document.activeElement).toBe(primaryButton());
  });

  it('does not close when Escape is pressed outside while closed', () => {
    const onClose = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <div>
        <button type="button" data-testid="outside">
          Outside
        </button>
        <TourPoint
          title="Tip"
          defaultOpen={false}
          onClose={onClose}
          onOpenChange={onOpenChange}
        >
          Body
        </TourPoint>
      </div>,
    );
    keyDown(document.querySelector('[data-testid="outside"]')!, 'Escape');
    expect(onClose).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(openDot()).not.toBeNull();
    expect(titleEl()).toBeNull();
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
