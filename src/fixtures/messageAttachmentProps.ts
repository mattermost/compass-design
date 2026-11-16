import type {
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
