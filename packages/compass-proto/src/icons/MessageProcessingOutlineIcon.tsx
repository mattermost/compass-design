import type { SVGAttributes } from 'react';

interface MessageProcessingOutlineIconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'color'
> {
  size?: number | string;
  color?: string;
}

/**
 * Speech bubble with three dots (the Channels product icon). Based on the
 * `message-processing-outline` glyph supplied for the Product Rail, with the
 * three dots drawn as circles instead of squares. @mattermost/compass-icons
 * does not ship this glyph. API matches the compass-icons components so it can
 * be passed as the `glyph` prop on the shared Icon component or rendered
 * directly.
 */
export default function MessageProcessingOutlineIcon({
  size,
  color,
  ...rest
}: MessageProcessingOutlineIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || '1em'}
      height={size || '1em'}
      fill={color || 'currentColor'}
      viewBox="0 0 24 24"
      {...rest}
    >
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M20 16H5.2L4 17.2V4H20V16M17 10a1 1 0 0 1-2 0 1 1 0 0 1 2 0ZM13 10a1 1 0 0 1-2 0 1 1 0 0 1 2 0ZM9 10a1 1 0 0 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
  );
}
