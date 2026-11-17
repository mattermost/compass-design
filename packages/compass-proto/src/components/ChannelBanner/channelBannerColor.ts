/**
 * Black or white text for a banner background, picked by the background's
 * relative luminance (WCAG), as the Mattermost webapp does. Takes a six-digit
 * hex color with or without `#`; anything else returns `undefined` so the
 * banner keeps its inherited text color.
 */
export function channelBannerTextColor(
  backgroundColor: string,
): '#000000' | '#FFFFFF' | undefined {
  const hex = backgroundColor.startsWith('#')
    ? backgroundColor.slice(1)
    : backgroundColor;
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return undefined;

  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  return luminance > 0.179 ? '#000000' : '#FFFFFF';
}
