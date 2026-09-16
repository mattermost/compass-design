import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import EmoticonPlusOutlineIcon from '@mattermost/compass-icons/components/emoticon-plus-outline';
import { EmojiPopover } from '@mattermost/compass-proto';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { useExitAnimation } from '@/hooks/useExitAnimation';
import patternStyles from '@/styles/library-demo/patterns.module.scss';
import styles from './emoji-popover.specimen.module.scss';

/** Matches `--duration-quick` (150ms). */
const EXIT_MS = 150;

function EmojiPopoverTriggerDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { rendered, exiting } = useExitAnimation(isOpen, EXIT_MS);

  // Capture trigger position when opening so the portal is placed correctly.
  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPopoverPos({ top: r.bottom + 4, left: r.left });
    }
  }, [isOpen]);

  // Trigger the enter animation on the frame after the portal mounts.
  useEffect(() => {
    if (!rendered || exiting) return;
    const id = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(id);
  }, [rendered, exiting]);

  // Reset animateIn once the exit animation finishes and the portal unmounts.
  useEffect(() => {
    if (!rendered) setAnimateIn(false);
  }, [rendered]);

  // Close on outside mousedown, but let the trigger button manage its own click.
  const close = useCallback(() => setIsOpen(false), []);
  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      close();
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, close]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        triggerRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const popoverVisible = animateIn && !exiting;

  return (
    <>
      <div ref={triggerRef} style={{ display: 'inline-flex' }}>
        <IconButton
          size="medium"
          icon={<Icon glyph={<EmoticonPlusOutlineIcon />} size="20" />}
          aria-label="Insert emoji"
          active={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        />
      </div>
      {rendered && popoverPos && createPortal(
        <div
          ref={popoverRef}
          style={{ position: 'fixed', top: popoverPos.top, left: popoverPos.left }}
          className={[
            styles['popover-anchor'],
            popoverVisible ? styles['popover-anchor--visible'] : '',
            exiting ? styles['popover-anchor--exiting'] : '',
          ].filter(Boolean).join(' ')}
        >
          <EmojiPopover onCustomEmojiClick={() => {}} />
        </div>,
        document.body,
      )}
    </>
  );
}

export default function EmojiPopoverSpecimen() {
  return (
    <div className={patternStyles['patterns']}>
      <header className={patternStyles['patterns__header']}>
        <h1 className={patternStyles['patterns__heading']}>Emoji Popover</h1>
        <p className={patternStyles['patterns__subheading']}>
          Browse and search emojis via a fixed-size popover surface.
        </p>
      </header>

      <section className={patternStyles['patterns__section']}>
        <h2 className={patternStyles['patterns__section-title']}>Open / close</h2>
        <p className={patternStyles['patterns__variant-label']}>
          Click the button to open the popover; click outside or press Escape to close
        </p>
        <div className={styles['trigger-demo']}>
          <EmojiPopoverTriggerDemo />
        </div>
      </section>

      <section className={patternStyles['patterns__section']}>
        <h2 className={patternStyles['patterns__section-title']}>Default</h2>
        <p className={patternStyles['patterns__variant-label']}>
          Full emoji grid grouped by category; skin-tone selector in search bar
        </p>
        <div className={patternStyles['patterns__popover-menu-demo']}>
          <EmojiPopover onCustomEmojiClick={() => {}} />
        </div>
      </section>

      <section className={patternStyles['patterns__section']}>
        <h2 className={patternStyles['patterns__section-title']}>Search results</h2>
        <p className={patternStyles['patterns__variant-label']}>
          Flat results group replacing the category grid
        </p>
        <div className={patternStyles['patterns__popover-menu-demo']}>
          <EmojiPopover defaultQuery="smile" />
        </div>
      </section>

      <section className={patternStyles['patterns__section']}>
        <h2 className={patternStyles['patterns__section-title']}>Empty search</h2>
        <p className={patternStyles['patterns__variant-label']}>
          No results; centered empty state
        </p>
        <div className={patternStyles['patterns__popover-menu-demo']}>
          <EmojiPopover defaultQuery="zzz" />
        </div>
      </section>
    </div>
  );
}
