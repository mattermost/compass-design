/** White text stays readable down to this contrast ratio (WCAG's floor for large text and UI). */
const MIN_WHITE_CONTRAST = 3;

/**
 * White or black text for a banner background. White is preferred: it is used
 * whenever it keeps at least a 3:1 contrast ratio with the background (WCAG
 * relative luminance), and black takes over only on lighter colors, so vivid
 * blues and greens get white text. (The Mattermost webapp switches at equal
 * contrast, about 0.179 luminance, which gives black text on those.) Takes a
 * six-digit hex color with or without `#`; anything else returns `undefined`
 * so the banner keeps its inherited text color.
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
  const whiteContrast = 1.05 / (luminance + 0.05);
  return whiteContrast >= MIN_WHITE_CONTRAST ? '#FFFFFF' : '#000000';
}
