import { useState } from 'react';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import AirplaneIcon from '@mattermost/compass-icons/components/airplane';
import ClockOutlineIcon from '@mattermost/compass-icons/components/clock-outline';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import EmoticonOutlineIcon from '@mattermost/compass-icons/components/emoticon-outline';
import FlagOutlineIcon from '@mattermost/compass-icons/components/flag-outline';
import FoodAppleIcon from '@mattermost/compass-icons/components/food-apple';
import HeartOutlineIcon from '@mattermost/compass-icons/components/heart-outline';
import LeafOutlineIcon from '@mattermost/compass-icons/components/leaf-outline';
import LightbulbOutlineIcon from '@mattermost/compass-icons/components/lightbulb-outline';
import { Emoji } from '@mattermost/compass-ui/components/emoji';
import { EmojiButton } from '@mattermost/compass-ui/components/emoji-button';
import { EmptyState } from '@mattermost/compass-ui/components/empty-state';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import { SearchInput } from '@mattermost/compass-ui/components/search-input';
import SearchIllustration from '@mattermost/compass-ui/illustrations/search';
import styles from './EmojiPopover.module.scss';

export type EmojiPopoverState = 'default' | 'search-results' | 'empty';

export interface EmojiPopoverProps {
  className?: string;
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

const SKIN_TONES = ['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿'];

const SHORTCODES: Record<string, string> = {
  '😀': 'grinning', '😃': 'smiley', '😄': 'smile', '😁': 'grin',
  '😆': 'laughing', '😅': 'sweat_smile', '🤣': 'rofl', '😂': 'joy',
  '🙂': 'slightly_smiling_face', '🙃': 'upside_down_face',
  '😉': 'wink', '😊': 'blush', '😇': 'innocent', '🥰': 'smiling_face_with_three_hearts',
  '😍': 'heart_eyes', '🤩': 'star_struck', '😘': 'kissing_heart',
  '😗': 'kissing', '😚': 'kissing_closed_eyes', '😙': 'kissing_smiling_eyes',
  '🥲': 'smiling_face_with_tear', '😋': 'yum', '😛': 'stuck_out_tongue',
  '😜': 'stuck_out_tongue_winking_eye', '🤪': 'zany_face',
  '😝': 'stuck_out_tongue_closed_eyes', '🤑': 'money_mouth_face',
  '🤗': 'hugs', '🤭': 'hand_over_mouth', '🤫': 'shushing_face',
  '🤔': 'thinking', '🤐': 'zipper_mouth_face', '🤨': 'raised_eyebrow',
  '😐': 'neutral_face', '😑': 'expressionless', '😶': 'no_mouth',
  '😏': 'smirk', '😒': 'unamused', '🙄': 'roll_eyes', '😬': 'grimacing',
  '🤥': 'lying_face', '😌': 'relieved', '😔': 'pensive',
  '😪': 'sleepy', '🤤': 'drooling_face', '😴': 'sleeping',
  '😷': 'mask', '🤒': 'face_with_thermometer', '🤕': 'face_with_head_bandage',
  '🤢': 'nauseated_face', '🤮': 'face_vomiting', '🤧': 'sneezing_face',
  '🥵': 'hot_face', '🥶': 'cold_face', '🥴': 'woozy_face',
  '😵': 'dizzy_face', '🤯': 'exploding_head', '🤠': 'cowboy_hat_face',
  '🥳': 'partying_face', '🥸': 'disguised_face', '😎': 'sunglasses',
  '🤓': 'nerd_face', '🧐': 'monocle_face', '😕': 'confused',
  '😟': 'worried', '🙁': 'slightly_frowning_face', '☹️': 'frowning_face',
  '😮': 'open_mouth', '😯': 'hushed', '😲': 'astonished',
  '😳': 'flushed', '🥺': 'pleading_face', '😦': 'frowning',
  '😧': 'anguished', '😨': 'fearful', '😰': 'cold_sweat',
  '😥': 'disappointed_relieved', '😢': 'cry', '😭': 'sob',
  '😱': 'scream', '😖': 'confounded', '😣': 'persevere',
  '😞': 'disappointed', '😓': 'sweat', '😩': 'weary', '😫': 'tired_face',
  '🥱': 'yawning_face', '😤': 'triumph', '😡': 'rage', '😠': 'angry',
  '👋': 'wave', '✋': 'raised_hand', '👌': 'ok_hand', '✌️': 'v',
  '🤞': 'crossed_fingers', '🤟': 'love_you_gesture', '🤘': 'metal',
  '🤙': 'call_me_hand', '👈': 'point_left', '👉': 'point_right',
  '👆': 'point_up_2', '👇': 'point_down', '☝️': 'point_up',
  '👍': '+1', '👎': '-1', '✊': 'fist', '👊': 'oncoming_fist',
  '👏': 'clap', '🙌': 'raised_hands', '👐': 'open_hands',
  '🙏': 'pray', '🤝': 'handshake', '💅': 'nail_care', '💪': 'muscle',
  '🐶': 'dog', '🐱': 'cat', '🐭': 'mouse', '🐹': 'hamster',
  '🐰': 'rabbit', '🦊': 'fox_face', '🐻': 'bear', '🐼': 'panda_face',
  '🐨': 'koala', '🐯': 'tiger', '🦁': 'lion', '🐮': 'cow',
  '🐷': 'pig', '🐸': 'frog', '🐵': 'monkey_face', '🙈': 'see_no_evil',
  '🙉': 'hear_no_evil', '🙊': 'speak_no_evil', '🐔': 'chicken',
  '🐧': 'penguin', '🐦': 'bird', '🐤': 'baby_chick', '🦆': 'duck',
  '🦅': 'eagle', '🦉': 'owl', '🦇': 'bat', '🐺': 'wolf',
  '🐗': 'boar', '🐴': 'horse', '🦄': 'unicorn',
  '🍎': 'apple', '🍊': 'tangerine', '🍋': 'lemon', '🍇': 'grapes',
  '🍓': 'strawberry', '🫐': 'blueberries', '🍒': 'cherries',
  '🍑': 'peach', '🥭': 'mango', '🍍': 'pineapple', '🥥': 'coconut',
  '🥝': 'kiwi_fruit', '🍅': 'tomato', '🥑': 'avocado',
  '🥦': 'broccoli', '🥬': 'leafy_green', '🥒': 'cucumber',
  '✈️': 'airplane', '🚀': 'rocket', '🛸': 'flying_saucer',
  '🚁': 'helicopter', '⛵': 'sailboat', '🚢': 'ship', '🚂': 'steam_locomotive',
  '🚄': 'bullettrain_side', '🚅': 'bullettrain_front', '🚗': 'car',
  '⚽': 'soccer', '🏀': 'basketball', '🏈': 'football', '⚾': 'baseball',
  '🎾': 'tennis', '🏐': 'volleyball', '🏓': 'table_tennis_paddle_and_ball',
  '❤️': 'heart', '🧡': 'orange_heart', '💛': 'yellow_heart',
  '💚': 'green_heart', '💙': 'blue_heart', '💜': 'purple_heart',
  '🖤': 'black_heart', '💔': 'broken_heart', '💕': 'two_hearts',
  '💖': 'sparkling_heart', '💘': 'cupid', '💌': 'love_letter',
  '💋': 'kiss', '💍': 'ring', '💎': 'gem', '🏆': 'trophy',
  '🏁': 'checkered_flag', '🚩': 'triangular_flag_on_post', '🎌': 'crossed_flags',
  '🏴': 'black_flag', '🏳️': 'white_flag',
  '🎉': 'tada',
};

function getShortcode(emoji: string): string {
  return SHORTCODES[emoji] ? `:${SHORTCODES[emoji]}:` : emoji;
}

export default function EmojiPopover({
  className = '',
  state = 'default',
}: EmojiPopoverProps) {
  const [activeCategoryId, setActiveCategoryId] = useState('recent');
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  const rootClass = [styles['emoji-popover'], className].filter(Boolean).join(' ');

  const emptyIllustration = {
    'aria-label': '' as const,
    width: '80px',
    height: '60px',
    children: <SearchIllustration />,
  };

  const renderBody = () => {
    if (state === 'empty') {
      return (
        <EmptyState
          illustration={emptyIllustration}
          title="No emojis found"
          description="Try a different search term."
        />
      );
    }

    if (state === 'search-results') {
      return (
        <div className={styles['emoji-popover__emoji-list']}>
          <div className={styles['emoji-popover__group']}>
            <div className={styles['emoji-popover__group-title']}>Search Results</div>
            <div className={styles['emoji-popover__emoji-row']}>
              {SEARCH_RESULTS.map((emoji) => (
                <EmojiButton
                  key={emoji}
                  emoji={emoji}
                  size="medium"
                  padding="compact"
                  aria-label={emoji}
                  onMouseEnter={() => setHoveredEmoji(emoji)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                />
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
                !cat.wrap ? styles['emoji-popover__emoji-row--nowrap'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {cat.emojis.map((emoji, i) => (
                <EmojiButton
                  key={`${cat.id}-${i}`}
                  emoji={emoji}
                  size="medium"
                  padding="compact"
                  aria-label={emoji}
                  onMouseEnter={() => setHoveredEmoji(emoji)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={rootClass}>
      <div className={styles['emoji-popover__header']}>
        <div className={styles['emoji-popover__search-row']}>
          <SearchInput
            placeholder="Search emojis"
            size="small"
            className={styles['emoji-popover__search-input']}
            defaultValue={state !== 'default' ? 'smile' : ''}
          />
          {state === 'default' && (
            <EmojiButton
              emoji={SKIN_TONES[0]}
              size="small"
              aria-label="Select skin tone"
            />
          )}
        </div>

        <div className={styles['emoji-popover__categories']}>
          {EMOJI_CATEGORIES.map((cat) => (
            <IconButton
              key={cat.id}
              size="small"
              padding="compact"
              icon={<Icon glyph={<cat.Icon />} size="16" />}
              aria-label={cat.label}
              active={activeCategoryId === cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
            />
          ))}
        </div>
      </div>

      <div className={styles['emoji-popover__scroll-view']}>
        {state === 'empty' ? (
          renderBody()
        ) : (
          <Scrollbar alwaysVisible>{renderBody()}</Scrollbar>
        )}
      </div>

      <div className={styles['emoji-popover__footer']}>
        {hoveredEmoji ? (
          <>
            <Emoji emoji={hoveredEmoji} size='32' />
            <span className={styles['emoji-popover__footer-shortcode']}>
              {getShortcode(hoveredEmoji)}
            </span>
          </>
        ) : (
          <span className={styles['emoji-popover__footer-hint']}>
            Select an Emoji
          </span>
        )}
      </div>
    </div>
  );
}
