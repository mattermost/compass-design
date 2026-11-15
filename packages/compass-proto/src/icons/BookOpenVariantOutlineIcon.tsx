import type { SVGAttributes } from 'react';

interface BookOpenVariantOutlineIconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'color'
> {
  size?: number | string;
  color?: string;
}

/**
 * Open book with text lines on the right page (the Docs product icon).
 * Supplied as an SVG for the Product Rail because @mattermost/compass-icons
 * does not ship this glyph. API matches the compass-icons components so it can
 * be passed as the `glyph` prop on the shared Icon component or rendered
 * directly.
 */
export default function BookOpenVariantOutlineIcon({
  size,
  color,
  ...rest
}: BookOpenVariantOutlineIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || '1em'}
      height={size || '1em'}
      fill={color || 'currentColor'}
      viewBox="0 0 24 24"
      {...rest}
    >
      <path d="M12 20.5C10.65 19.65 8.2 19 6.5 19C4.85 19 3.15 19.3 1.75 20.05C1.65 20.1 1.6 20.1 1.5 20.1C1.25 20.1 1 19.85 1 19.6V5C1.6 4.55 2.25 4.25 3 4C4.11 3.65 5.33 3.5 6.5 3.5C8.45 3.5 10.55 3.9 12 5C13.45 3.9 15.55 3.5 17.5 3.5C18.67 3.5 19.89 3.65 21 4C21.75 4.25 22.4 4.55 23 5V19.6C23 19.85 22.75 20.1 22.5 20.1C22.4 20.1 22.35 20.1 22.25 20.05C20.85 19.3 19.15 19 17.5 19C15.8 19 13.35 19.65 12 20.5M11 6.5C9.64 5.9 7.84 5.5 6.5 5.5C5.3 5.5 4.1 5.65 3 6V17.5C4.1 17.15 5.3 17 6.5 17C7.84 17 9.64 17.4 11 18V6.5M13 18C14.36 17.4 16.16 17 17.5 17C18.7 17 19.9 17.15 21 17.5V6C19.9 5.65 18.7 5.5 17.5 5.5C16.16 5.5 14.36 5.9 13 6.5V18M14 15.35C14.96 15 16.12 14.83 17.5 14.83C18.54 14.83 19.38 14.91 20 15.07V13.57C19.13 13.41 18.29 13.33 17.5 13.33C16.16 13.33 15 13.5 14 13.76V15.35M14 12.69C14.96 12.34 16.12 12.16 17.5 12.16C18.54 12.16 19.38 12.24 20 12.4V10.9C19.13 10.74 18.29 10.67 17.5 10.67C16.22 10.67 15.05 10.82 14 11.12V12.69M14 10C14.96 9.67 16.12 9.5 17.5 9.5C18.41 9.5 19.26 9.59 20 9.78V8.23C19.13 8.08 18.29 8 17.5 8C16.18 8 15 8.15 14 8.46V10Z" />
    </svg>
  );
}
