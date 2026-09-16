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
import type { EmojiCategory } from '@mattermost/compass-ui/components/emoji-popover';

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'recent',
    icon: ClockOutlineIcon,
    label: 'Recently Used',
    emojis: ['😀', '👍', '🎉', '🙏', '😂', '❤️'],
    wrap: false,
  },
  {
    id: 'smileys',
    icon: EmoticonHappyOutlineIcon,
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
  },
  {
    id: 'people',
    icon: AccountOutlineIcon,
    label: 'People & Body',
    emojis: [
      '👋', '🤚', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰',
      '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '🫵', '👍',
      '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲',
      '🙏', '🤝', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃',
    ],
  },
  {
    id: 'nature',
    icon: LeafOutlineIcon,
    label: 'Animals & Nature',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧',
      '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄',
    ],
  },
  {
    id: 'food',
    icon: FoodAppleIcon,
    label: 'Food & Drink',
    emojis: [
      '🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍',
      '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🧄', '🧅',
      '🌽', '🥕', '🍞', '🥐', '🧀', '🍳', '🥚', '🧇', '🥞', '🧆',
    ],
  },
  {
    id: 'travel',
    icon: AirplaneIcon,
    label: 'Travel & Places',
    emojis: [
      '✈️', '🚀', '🛸', '🚁', '⛵', '🚢', '🚂', '🚄', '🚅', '🚇',
      '🚌', '🚎', '🚑', '🚒', '🚓', '🚔', '🚕', '🚗', '🚙', '🛻',
      '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲',
    ],
  },
  {
    id: 'activities',
    icon: LightbulbOutlineIcon,
    label: 'Activities',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🎣', '🤿',
      '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🤺', '🏇', '⛷️',
    ],
  },
  {
    id: 'objects',
    icon: HeartOutlineIcon,
    label: 'Objects',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌',
      '💋', '💍', '💎', '🏆', '🥇', '🥈', '🥉', '🎖️', '🏅', '🎗️',
    ],
  },
  {
    id: 'flags',
    icon: FlagOutlineIcon,
    label: 'Flags',
    emojis: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️',
      '🇺🇸', '🇬🇧', '🇩🇪', '🇫🇷', '🇯🇵', '🇨🇳', '🇧🇷', '🇨🇦',
      '🇦🇺', '🇮🇳', '🇰🇷', '🇲🇽', '🇳🇬', '🇸🇦', '🇿🇦', '🇦🇷',
    ],
  },
  {
    id: 'custom',
    icon: EmoticonOutlineIcon,
    label: 'Custom Emojis',
    emojis: ['😀', '🎉', '🚀', '❤️', '👏'],
    wrap: false,
  },
];

export const SHORTCODES: Record<string, string> = {
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
