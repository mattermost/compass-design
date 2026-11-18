import type { SVGAttributes } from 'react';

interface MessageProcessingOutlineIconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'color'
> {
  size?: number | string;
  color?: string;
}

/**
 * Speech bubble with three round dots (the Channels product icon). Supplied as
 * an SVG for the Product Rail because @mattermost/compass-icons does not ship
 * this glyph. API matches the compass-icons components so it can be passed as
 * the `glyph` prop on the shared Icon component or rendered directly.
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
      <path d="M20 2C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H6L2 22V4C2 2.89 2.9 2 4 2H20ZM4 4V17.17L5.17 16H20V4H4Z M9 10C9 10.8284 8.32843 11.5 7.5 11.5C6.67157 11.5 6 10.8284 6 10C6 9.17157 6.67157 8.5 7.5 8.5C8.32843 8.5 9 9.17157 9 10Z M13.5 10C13.5 10.8284 12.8284 11.5 12 11.5C11.1716 11.5 10.5 10.8284 10.5 10C10.5 9.17157 11.1716 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10Z M18 10C18 10.8284 17.3284 11.5 16.5 11.5C15.6716 11.5 15 10.8284 15 10C15 9.17157 15.6716 8.5 16.5 8.5C17.3284 8.5 18 9.17157 18 10Z" />
    </svg>
  );
}
