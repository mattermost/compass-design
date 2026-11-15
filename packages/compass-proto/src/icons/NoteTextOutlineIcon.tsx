import type { SVGAttributes } from 'react';

interface NoteTextOutlineIconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'color'
> {
  size?: number | string;
  color?: string;
}

/**
 * Note page with a folded corner and text lines (the Docs product icon).
 * Supplied as an SVG for the Product Rail because @mattermost/compass-icons
 * does not ship this glyph. API matches the compass-icons components so it can
 * be passed as the `glyph` prop on the shared Icon component or rendered
 * directly.
 */
export default function NoteTextOutlineIcon({
  size,
  color,
  ...rest
}: NoteTextOutlineIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || '1em'}
      height={size || '1em'}
      fill={color || 'currentColor'}
      viewBox="0 0 24 24"
      {...rest}
    >
      <path d="M15 3H5A2 2 0 0 0 3 5V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9L15 3M19 19H5V5H14V10H19M17 14H7V12H17M14 17H7V15H14" />
    </svg>
  );
}
