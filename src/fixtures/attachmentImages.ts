// Every image in `src/assets/attachment-images/`, keyed by file name without the
// extension. The fixture generator saves the images attachments point at there
// (`FixtureSlackAttachment.imageId` / `thumbId`), so a refresh needs no edit here.
const files = import.meta.glob('@/assets/attachment-images/*.{png,jpg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/** Attachment image id -> image URL. */
export const attachmentImages: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.[^.]+$/, ''),
    url,
  ]),
);
