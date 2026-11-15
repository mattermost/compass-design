import type { SVGAttributes } from 'react';

interface ClipboardTextOutlineIconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'color'
> {
  size?: number | string;
  color?: string;
}

/**
 * Clipboard with text lines (the Playbooks product icon). Supplied as an SVG for the Product Rail because
 * @mattermost/compass-icons does not ship this glyph. API matches the
 * compass-icons components so it can be passed as the `glyph` prop on the
 * shared Icon component or rendered directly.
 */
export default function ClipboardTextOutlineIcon({
  size,
  color,
  ...rest
}: ClipboardTextOutlineIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || '1em'}
      height={size || '1em'}
      fill={color || 'currentColor'}
      viewBox="0 0 24 24"
      {...rest}
    >
      <path d="M19 2.99999H14.82C14.25 1.43999 12.53 0.639994 11 1.19999C10.14 1.49999 9.5 2.15999 9.18 2.99999H5C4.46957 2.99999 3.96086 3.21071 3.58579 3.58578C3.21071 3.96085 3 4.46956 3 4.99999V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V4.99999C21 4.46956 20.7893 3.96085 20.4142 3.58578C20.0391 3.21071 19.5304 2.99999 19 2.99999ZM7 5.99999H17V4.99999H19V19H5V4.99999H7V5.99999ZM17 11H7V8.99999H17V11ZM15 15H7V13H15V15Z" />
    </svg>
  );
}
