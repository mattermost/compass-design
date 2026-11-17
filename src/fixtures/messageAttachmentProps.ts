import type {
  FixturePost,
  FixtureSlackAttachment,
  MessageAttachmentProps,
} from '@mattermost/compass-proto';

/** Maps a fixture (Mattermost / Slack format) attachment onto `MessageAttachment` props. */
export function toMessageAttachmentProps(
  a: FixtureSlackAttachment,
): MessageAttachmentProps {
  return {
    color: a.color,
    pretext: a.pretext,
    title: a.title,
    titleHref: a.titleLink,
    text: a.text,
    fields: a.fields,
    imageSrc: a.imageUrl,
    thumbSrc: a.thumbUrl,
    actions: a.actions?.map((x) => ({ label: x.name, href: x.url })),
    footer: a.footer,
    footerIconSrc: a.footerIcon,
  };
}

/**
 * The cards for a post, with its headline moved inside the first card.
 *
 * Integrations often send the headline as the post's message text and leave
 * the attachment without a title, so it would sit above the card. When a post
 * has attachments, the first has no title, and the text is a single Markdown
 * heading, that heading becomes the card's title and `hoisted` is true (the
 * caller then leaves the text out of the message body). Any other post is
 * returned as it is.
 */
export function postAttachmentProps(post: FixturePost): {
  cards: MessageAttachmentProps[];
  hoisted: boolean;
} {
  const cards = (post.attachments ?? []).map(toMessageAttachmentProps);
  const headline = /^#+\s+([^\n]+)$/.exec(post.text.trim())?.[1];
  const hoisted = Boolean(headline) && cards.length > 0 && !cards[0]!.title;
  if (hoisted) cards[0] = { ...cards[0]!, title: headline };
  return { cards, hoisted };
}
