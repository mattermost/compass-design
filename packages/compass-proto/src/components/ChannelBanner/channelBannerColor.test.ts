import { describe, expect, it } from 'vitest';
import { channelBannerTextColor } from './channelBannerColor';

describe('channelBannerTextColor', () => {
  it('picks black on light backgrounds and white on dark ones', () => {
    expect(channelBannerTextColor('#FFF0BA')).toBe('#000000');
    expect(channelBannerTextColor('#FFFFFF')).toBe('#000000');
    expect(channelBannerTextColor('#1C58D9')).toBe('#FFFFFF');
    expect(channelBannerTextColor('#000000')).toBe('#FFFFFF');
  });

  it('prefers white on vivid mid-tones and black once white drops below 3:1', () => {
    expect(channelBannerTextColor('#0F93FF')).toBe('#FFFFFF');
    expect(channelBannerTextColor('#2E8540')).toBe('#FFFFFF');
    expect(channelBannerTextColor('#0071BC')).toBe('#FFFFFF');
    expect(channelBannerTextColor('#FFAF00')).toBe('#000000');
    expect(channelBannerTextColor('#7ECBC0')).toBe('#000000');
  });

  it('accepts a color with or without the hash, in either case', () => {
    expect(channelBannerTextColor('fff0ba')).toBe('#000000');
    expect(channelBannerTextColor('#1c58d9')).toBe('#FFFFFF');
  });

  it('returns nothing for anything but a six-digit hex color', () => {
    for (const bad of ['', '#FFF', 'red', 'rgb(0,0,0)', '#GGGGGG', '#FFF0BA00'])
      expect(channelBannerTextColor(bad)).toBeUndefined();
  });
});
