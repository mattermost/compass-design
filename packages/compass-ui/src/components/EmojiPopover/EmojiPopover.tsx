import { useEffect, useId, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import CloseIcon from '@mattermost/compass-icons/components/close';
import Button from '@/components/Button/Button';
import Emoji from '@/components/Emoji/Emoji';
import EmojiButton from '@/components/EmojiButton/EmojiButton';
import EmptyState from '@/components/EmptyState/EmptyState';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import MenuGroupHeading from '@/components/MenuGroupHeading/MenuGroupHeading';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import SearchInput from '@/components/SearchInput/SearchInput';
import SearchIllustration from '@/illustrations/search';
import styles from './EmojiPopover.module.scss';

export interface EmojiCategory {
  id: string;
  label: string;
  /** Icon component rendered in the category navigation bar. */
  icon: ComponentType;
  emojis: string[];
  /** When false the row does not wrap (e.g. Recently Used). @default true */
  wrap?: boolean;
}

export interface EmojiPopoverProps {
  className?: string;
  /** Emoji categories to display, supplied by the host. */
  categories: EmojiCategory[];
  /** Map of base emoji → shortcode name used for footer display. */
  shortcodes?: Record<string, string>;
  /** Pre-seeds the search field. Useful for static specimen demos. */
  defaultQuery?: string;
  /** Focus the search field on mount. */
  autoFocus?: boolean;
  /** Called with the selected emoji character. */
  onEmojiSelect?: (emoji: string) => void;
  /**
   * Called on every query change. Use this to trigger async custom-emoji
   * searches on the host side; local filtering over `categories` always runs.
   */
  onSearch?: (query: string) => void;
  /** Shows a tertiary button in the footer right. Omit to hide the button. */
  onCustomEmojiClick?: () => void;
  /** Label for the custom emoji button. @default 'Custom emoji' */
  customEmojiLabel?: string;
}

const SKIN_TONES = ['🖐️', '🖐🏻', '🖐🏼', '🖐🏽', '🖐🏾', '🖐🏿'];
const SKIN_TONE_MODIFIERS = ['', '\u{1F3FB}', '\u{1F3FC}', '\u{1F3FD}', '\u{1F3FE}', '\u{1F3FF}'];

const MODIFIER_BASES = new Set([
  '👋', '🤚', '✋', '🖐️', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰',
  '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '🫵', '👍', '👎',
  '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🙏', '💅',
  '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃',
]);

function applyModifier(emoji: string, modifier: string): string {
  if (!modifier || !MODIFIER_BASES.has(emoji)) return emoji;
  // Strip VS16 before the modifier so composed sequences render correctly
  return emoji.replace('️', '') + modifier;
}

export default function EmojiPopover({
  className = '',
  categories,
  shortcodes = {},
  defaultQuery = '',
  autoFocus = false,
  onEmojiSelect,
  onSearch,
  onCustomEmojiClick,
  customEmojiLabel = 'Custom emoji',
}: EmojiPopoverProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const [hoveredBase, setHoveredBase] = useState<string | null>(null);
  const [skinToneIndex, setSkinToneIndex] = useState(0);
  const [showSkinTonePicker, setShowSkinTonePicker] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const skinTonePickerId = `${generatedId}-skin-tone-picker`;
  const skinToneModifier = SKIN_TONE_MODIFIERS[skinToneIndex];
  const scrollRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (autoFocus) searchRef.current?.focus();
  }, [autoFocus]);

  const handleQueryChange = (next: string) => {
    setQuery(next);
    onSearch?.(next);
  };

  const allEmojis = [...new Set(categories.flatMap((c) => c.emojis))];
  const searchResults = query
    ? allEmojis.filter((emoji) => {
        const name = shortcodes[emoji] ?? '';
        return name.includes(query.toLowerCase()) || emoji === query;
      })
    : [];

  const computedState = query
    ? searchResults.length > 0 ? 'search-results' : 'empty'
    : 'default';

  function getShortcode(emoji: string): string {
    return shortcodes[emoji] ? `:${shortcodes[emoji]}:` : emoji;
  }

  function scrollToCategory(id: string) {
    const group = groupRefs.current[id];
    const scroller = scrollRef.current;
    if (!group || !scroller) return;
    const top = group.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    scroller.scrollTo({ top, behavior: 'smooth' });
  }

  const rootClass = [styles['emoji-popover'], className].filter(Boolean).join(' ');

  const emptyIllustration = {
    'aria-label': '' as const,
    width: '80px',
    height: '60px',
    children: <SearchIllustration />,
  };

  const renderEmoji = (emoji: string) => {
    const displayed = applyModifier(emoji, skinToneModifier);
    return (
      <EmojiButton
        key={emoji}
        emoji={displayed}
        size="medium"
        padding="compact"
        aria-label={displayed}
        onMouseEnter={() => { setHoveredEmoji(displayed); setHoveredBase(emoji); }}
        onMouseLeave={() => { setHoveredEmoji(null); setHoveredBase(null); }}
        onClick={() => onEmojiSelect?.(displayed)}
      />
    );
  };

  const renderBody = () => {
    if (computedState === 'empty') {
      return (
        <EmptyState
          illustration={emptyIllustration}
          title="No emojis found"
          description="Try a different search term."
        />
      );
    }

    if (computedState === 'search-results') {
      return (
        <div className={styles['emoji-popover__emoji-list']}>
          <div className={styles['emoji-popover__group']}>
            <MenuGroupHeading label="Search Results" />
            <div className={styles['emoji-popover__emoji-row']}>
              {searchResults.map(renderEmoji)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles['emoji-popover__emoji-list']}>
        {categories.map((cat) => (
          <div key={cat.id} ref={(el) => { groupRefs.current[cat.id] = el; }} className={styles['emoji-popover__group']}>
            <MenuGroupHeading label={cat.label} />
            <div
              className={[
                styles['emoji-popover__emoji-row'],
                cat.wrap === false ? styles['emoji-popover__emoji-row--nowrap'] : '',
              ].filter(Boolean).join(' ')}
            >
              {cat.emojis.map(renderEmoji)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={rootClass}>
      <div className={styles['emoji-popover__header']}>
        <div className={styles['emoji-popover__header-panels']}>
          <div
            className={[
              styles['emoji-popover__header-main'],
              showSkinTonePicker ? styles['emoji-popover__header-main--hidden'] : '',
            ].filter(Boolean).join(' ')}
            inert={showSkinTonePicker}
            aria-hidden={showSkinTonePicker || undefined}
          >
            <div className={styles['emoji-popover__search-row']}>
              <SearchInput
                ref={searchRef}
                placeholder="Search emojis"
                size="small"
                className={styles['emoji-popover__search-input']}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onClear={() => handleQueryChange('')}
              />
              {!query && (
                <EmojiButton
                  emoji={SKIN_TONES[skinToneIndex]}
                  size="small"
                  aria-label="Select skin tone"
                  aria-expanded={showSkinTonePicker}
                  aria-controls={skinTonePickerId}
                  onClick={() => setShowSkinTonePicker(true)}
                />
              )}
            </div>
          </div>

          <div
            id={skinTonePickerId}
            className={[
              styles['emoji-popover__skin-tone-picker'],
              showSkinTonePicker ? styles['emoji-popover__skin-tone-picker--visible'] : '',
            ].filter(Boolean).join(' ')}
            inert={!showSkinTonePicker}
            aria-hidden={!showSkinTonePicker || undefined}
          >
            <span className={styles['emoji-popover__skin-tone-label']}>Skin tone</span>
            <div className={styles['emoji-popover__skin-tone-options']}>
              {SKIN_TONES.map((emoji, i) => (
                <EmojiButton
                  key={i}
                  emoji={emoji}
                  size="small"
                  toggled={skinToneIndex === i}
                  aria-label={i === 0 ? 'Default skin tone' : `Skin tone ${i}`}
                  onClick={() => { setSkinToneIndex(i); setShowSkinTonePicker(false); }}
                />
              ))}
            </div>
            <IconButton
              size="small"
              padding="compact"
              icon={<Icon glyph={<CloseIcon />} size="16" />}
              aria-label="Close skin tone picker"
              onClick={() => setShowSkinTonePicker(false)}
            />
          </div>
        </div>

        {!query && (
          <div className={styles['emoji-popover__categories']}>
            {categories.map((cat) => (
              <IconButton
                key={cat.id}
                size="small"
                padding="compact"
                icon={<Icon glyph={<cat.icon />} size="16" />}
                aria-label={cat.label}
                active={activeCategoryId === cat.id}
                onClick={() => { setActiveCategoryId(cat.id); scrollToCategory(cat.id); }}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles['emoji-popover__scroll-view']}>
        {computedState === 'empty' ? (
          renderBody()
        ) : (
          <Scrollbar alwaysVisible ref={scrollRef}>{renderBody()}</Scrollbar>
        )}
      </div>

      <div className={styles['emoji-popover__footer']}>
        <div className={styles['emoji-popover__footer-preview']}>
          {hoveredEmoji ? (
            <>
              <Emoji emoji={hoveredEmoji} size='32' />
              <span className={styles['emoji-popover__footer-shortcode']}>
                {getShortcode(hoveredBase ?? '')}
              </span>
            </>
          ) : (
            <span className={styles['emoji-popover__footer-hint']}>
              Select an Emoji
            </span>
          )}
        </div>
        {onCustomEmojiClick && (
          <Button emphasis="tertiary" size="small" onClick={onCustomEmojiClick}>
            {customEmojiLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
