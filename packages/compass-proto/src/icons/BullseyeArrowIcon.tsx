import type { SVGAttributes } from 'react';

interface BullseyeArrowIconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'color'
> {
  size?: number | string;
  color?: string;
}

/**
 * Target with an arrow in the bullseye (the Boards product icon), in the
 * adjusted lighter drawing supplied by design. Supplied as an SVG for the
 * Product Rail because @mattermost/compass-icons does not ship this glyph. API
 * matches the compass-icons components so it can be passed as the `glyph` prop
 * on the shared Icon component or rendered directly.
 */
export default function BullseyeArrowIcon({
  size,
  color,
  ...rest
}: BullseyeArrowIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || '1em'}
      height={size || '1em'}
      fill={color || 'currentColor'}
      viewBox="0 0 24 24"
      {...rest}
    >
      <path d="M12 2C13.6684 2 15.2401 2.4112 16.623 3.13379L15.124 4.63281C14.1642 4.22531 13.1084 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 10.8911 19.774 9.83509 19.3662 8.875L20.8652 7.37598C21.5882 8.75922 22 10.3311 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 6C12.5373 6 13.0582 6.07064 13.5537 6.20312L11.749 8.00781C9.6568 8.13734 8 9.87516 8 12C8 14.2091 9.79086 16 12 16C14.1252 16 15.8621 14.3427 15.9912 12.25L17.7959 10.4453C17.9286 10.9412 18 11.4623 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6ZM20 4H22L19 7L18.2666 7.14648L13.9297 11.4834C13.9738 11.6484 14 11.8211 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C12.1785 10 12.351 10.0255 12.5156 10.0693L16.8535 5.73145L17 5L20 2V4Z" />
    </svg>
  );
}
