import { useState } from 'react';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import AirplaneIcon from '@mattermost/compass-icons/components/airplane';
import ClockOutlineIcon from '@mattermost/compass-icons/components/clock-outline';
import CloseIcon from '@mattermost/compass-icons/components/close';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import EmoticonOutlineIcon from '@mattermost/compass-icons/components/emoticon-outline';
import FlagOutlineIcon from '@mattermost/compass-icons/components/flag-outline';
import FoodAppleIcon from '@mattermost/compass-icons/components/food-apple';
import HeartOutlineIcon from '@mattermost/compass-icons/components/heart-outline';
import LeafOutlineIcon from '@mattermost/compass-icons/components/leaf-outline';
import LightbulbOutlineIcon from '@mattermost/compass-icons/components/lightbulb-outline';
import MagnifyIcon from '@mattermost/compass-icons/components/magnify';
import { Icon } from '@mattermost/compass-ui/components/icon';
import styles from './EmojiPopover.module.scss';

export type EmojiPopoverTab = 'emojis' | 'gifs';
export type EmojiPopoverState = 'default' | 'search-results' | 'empty';

export interface EmojiPopoverProps {
  className?: string;
  /** Starting active tab. The component manages tab switching internally. */
  defaultTab?: EmojiPopoverTab;
  /** Content-area state to display. @default 'default' */
  state?: EmojiPopoverState;
}

const EMOJI_CATEGORIES = [
  {
    id: 'recent',
    Icon: ClockOutlineIcon,
    label: 'Recently Used',
    emojis: ['😀', '👍', '🎉', '🙏', '😂', '❤️'],
    wrap: false,
  },
  {
    id: 'smileys',
    Icon: EmoticonHappyOutlineIcon,
    label: 'Smileys & Emotions',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫',
      '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
      '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢',
      '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸',
      '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲',
      '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱',
    ],
    wrap: true,
  },
  {
    id: 'people',
    Icon: AccountOutlineIcon,
    label: 'People & Body',
    emojis: [
      '👋', '🤚', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰',
      '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '🫵', '👍',
      '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲',
      '🙏', '🤝', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃',
    ],
    wrap: true,
  },
  {
    id: 'nature',
    Icon: LeafOutlineIcon,
    label: 'Animals & Nature',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧',
      '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄',
    ],
    wrap: true,
  },
  {
    id: 'food',
    Icon: FoodAppleIcon,
    label: 'Food & Drink',
    emojis: [
      '🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍',
      '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🧄', '🧅',
      '🌽', '🥕', '🍞', '🥐', '🧀', '🍳', '🥚', '🧇', '🥞', '🧆',
    ],
    wrap: true,
  },
  {
    id: 'travel',
    Icon: AirplaneIcon,
    label: 'Travel & Places',
    emojis: [
      '✈️', '🚀', '🛸', '🚁', '⛵', '🚢', '🚂', '🚄', '🚅', '🚇',
      '🚌', '🚎', '🚑', '🚒', '🚓', '🚔', '🚕', '🚗', '🚙', '🛻',
      '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲',
    ],
    wrap: true,
  },
  {
    id: 'activities',
    Icon: LightbulbOutlineIcon,
    label: 'Activities',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🎣', '🤿',
      '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🤺', '🏇', '⛷️',
    ],
    wrap: true,
  },
  {
    id: 'objects',
    Icon: HeartOutlineIcon,
    label: 'Objects',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌',
      '💋', '💍', '💎', '🏆', '🥇', '🥈', '🥉', '🎖️', '🏅', '🎗️',
    ],
    wrap: true,
  },
  {
    id: 'flags',
    Icon: FlagOutlineIcon,
    label: 'Flags',
    emojis: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️',
      '🇺🇸', '🇬🇧', '🇩🇪', '🇫🇷', '🇯🇵', '🇨🇳', '🇧🇷', '🇨🇦',
      '🇦🇺', '🇮🇳', '🇰🇷', '🇲🇽', '🇳🇬', '🇸🇦', '🇿🇦', '🇦🇷',
    ],
    wrap: true,
  },
  {
    id: 'custom',
    Icon: EmoticonOutlineIcon,
    label: 'Custom Emojis',
    emojis: ['😀', '🎉', '🚀', '❤️', '👏'],
    wrap: false,
  },
];

const SEARCH_RESULTS = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😇', '😉',
  '😊', '😋', '😌', '😍', '🤩', '😘', '😗', '😚', '😙', '😛',
  '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '😐', '😑',
];

const GIF_TILE_HEIGHTS = ['', '--tall', '', '--tall', '--tall', '', '--tall', '', '', '--tall', '', ''];

export default function EmojiPopover({
  className = '',
  defaultTab = 'emojis',
  state = 'default',
}: EmojiPopoverProps) {
  const [activeTab, setActiveTab] = useState<EmojiPopoverTab>(defaultTab);
  const [activeCategoryId, setActiveCategoryId] = useState('recent');
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  const rootClass = [styles['emoji-popover'], className].filter(Boolean).join(' ');

  const renderEmojis = () => {
    if (state === 'empty') {
      return (
        <div className={styles['emoji-popover__empty']}>
          <div className={styles['emoji-popover__empty-icon']}>😔</div>
          <p className={styles['emoji-popover__empty-title']}>No emojis found</p>
          <p className={styles['emoji-popover__empty-description']}>
            Try a different search term.
          </p>
        </div>
      );
    }

    if (state === 'search-results') {
      return (
        <div className={styles['emoji-popover__emoji-list']}>
          <div className={styles['emoji-popover__group']}>
            <div className={styles['emoji-popover__group-title']}>Search Results</div>
            <div className={styles['emoji-popover__emoji-row']}>
              {SEARCH_RESULTS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={styles['emoji-popover__emoji-btn']}
                  aria-label={emoji}
                  onMouseEnter={() => setHoveredEmoji(emoji)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles['emoji-popover__emoji-list']}>
        {EMOJI_CATEGORIES.map((cat) => (
          <div key={cat.id} className={styles['emoji-popover__group']}>
            <div className={styles['emoji-popover__group-title']}>{cat.label}</div>
            <div
              className={[
                styles['emoji-popover__emoji-row'],
                !cat.wrap ? styles['emoji-popover__emoji-row--recent'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {cat.emojis.map((emoji, i) => (
                <button
                  key={`${cat.id}-${i}`}
                  type="button"
                  className={styles['emoji-popover__emoji-btn']}
                  aria-label={emoji}
                  onMouseEnter={() => setHoveredEmoji(emoji)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGifs = () => {
    if (state === 'empty') {
      return (
        <div className={styles['emoji-popover__empty']}>
          <div className={styles['emoji-popover__empty-icon']}>🔍</div>
          <p className={styles['emoji-popover__empty-title']}>No GIFs found</p>
          <p className={styles['emoji-popover__empty-description']}>
            Try a different search term.
          </p>
        </div>
      );
    }

    const tileCount = state === 'search-results' ? 12 : 8;

    return (
      <>
        <div className={styles['emoji-popover__gif-grid']}>
          {Array.from({ length: tileCount }).map((_, i) => (
            <div
              key={i}
              className={[
                styles['emoji-popover__gif-tile'],
                GIF_TILE_HEIGHTS[i % GIF_TILE_HEIGHTS.length]
                  ? styles[`emoji-popover__gif-tile${GIF_TILE_HEIGHTS[i % GIF_TILE_HEIGHTS.length]}`]
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          ))}
        </div>
        <div className={styles['emoji-popover__gif-branding']}>
          Powered by GIPHY
        </div>
      </>
    );
  };

  const footerLabel =
    hoveredEmoji ?? (activeTab === 'emojis' ? 'Select an Emoji' : 'Search for a GIF');

  return (
    <div className={rootClass}>
      <div className={styles['emoji-popover__header']}>
        {/* Tabs */}
        <div className={styles['emoji-popover__tabs']}>
          <button
            type="button"
            className={[
              styles['emoji-popover__tab'],
              activeTab === 'emojis' ? styles['emoji-popover__tab--active'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveTab('emojis')}
          >
            Emojis
          </button>
          <button
            type="button"
            className={[
              styles['emoji-popover__tab'],
              activeTab === 'gifs' ? styles['emoji-popover__tab--active'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveTab('gifs')}
          >
            GIFs
          </button>
        </div>

        {/* Search bar */}
        <div className={styles['emoji-popover__search-row']}>
          <div className={styles['emoji-popover__search-input-wrapper']}>
            <span className={styles['emoji-popover__search-icon']}>
              <Icon glyph={<MagnifyIcon />} size="16" />
            </span>
            <input
              type="text"
              className={styles['emoji-popover__search-input']}
              placeholder={activeTab === 'emojis' ? 'Search emojis' : 'Search GIFs'}
              aria-label={activeTab === 'emojis' ? 'Search emojis' : 'Search GIFs'}
              defaultValue={state !== 'default' ? 'smile' : ''}
            />
          </div>
          {activeTab === 'emojis' && state === 'default' && (
            <button
              type="button"
              className={styles['emoji-popover__skin-tone-btn']}
              aria-label="Select skin tone"
            >
              ✋
            </button>
          )}
          {state !== 'default' && (
            <button
              type="button"
              className={styles['emoji-popover__skin-tone-btn']}
              aria-label="Clear search"
            >
              <Icon glyph={<CloseIcon />} size="16" />
            </button>
          )}
        </div>

        {/* Category navigation — Emojis tab only */}
        {activeTab === 'emojis' && (
          <div className={styles['emoji-popover__categories']}>
            {EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={[
                  styles['emoji-popover__category-btn'],
                  activeCategoryId === cat.id
                    ? styles['emoji-popover__category-btn--active']
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={cat.label}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                <Icon glyph={<cat.Icon />} size="16" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className={styles['emoji-popover__scroll-view']}>
        {activeTab === 'emojis' ? renderEmojis() : renderGifs()}
      </div>

      {/* Footer */}
      <div className={styles['emoji-popover__footer']}>{footerLabel}</div>
    </div>
  );
}
