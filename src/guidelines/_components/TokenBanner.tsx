import { useLayoutEffect, useState, type ComponentProps } from 'react';
import { ChannelBanner } from '@mattermost/compass-proto';

type TokenBannerProps = Omit<
  ComponentProps<typeof ChannelBanner>,
  'backgroundColor'
> & {
  /** A color token, such as `--color-blue-500`. */
  token: `--color-${string}`;
};

/**
 * A `ChannelBanner` whose background is a color token. The banner picks its
 * text color from a hex value, so the token is read from the page's styles
 * (the same value the rest of the docs use) and passed on as hex.
 */
export default function TokenBanner({ token, ...rest }: TokenBannerProps) {
  const [hex, setHex] = useState('');
  useLayoutEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(token)
      .trim();
    setHex(/^#[0-9a-fA-F]{6}$/.test(value) ? value : '');
  }, [token]);
  return <ChannelBanner backgroundColor={hex} {...rest} />;
}
