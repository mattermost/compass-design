import { EmojiPopover as EmojiPopoverUI } from '@mattermost/compass-ui/components/emoji-popover';
import type { EmojiPopoverProps } from '@mattermost/compass-ui/components/emoji-popover';
import { EMOJI_CATEGORIES, SHORTCODES } from './fixtures';

type EmojiPopoverDemoProps = Omit<EmojiPopoverProps, 'categories'> & {
  categories?: EmojiPopoverProps['categories'];
};

/** Pre-filled wrapper around EmojiPopover for prototyping and guideline specimens. */
export default function EmojiPopover({ categories = EMOJI_CATEGORIES, shortcodes = SHORTCODES, ...rest }: EmojiPopoverDemoProps) {
  return <EmojiPopoverUI categories={categories} shortcodes={shortcodes} {...rest} />;
}
