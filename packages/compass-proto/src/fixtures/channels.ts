import type { FixtureChannel } from './types';

/**
 * Sample channels for the default team. Public and private names match the
 * default sidebar tree from `buildDefaultChannelsSidebarModel`.
 */
export const fixtureChannels: readonly FixtureChannel[] = [
  {
    id: 'ux-design',
    teamId: 'contributors',
    type: 'public',
    name: 'UX Design',
    purpose: 'Design reviews and critique',
  },
  {
    id: 'ui-redesign',
    teamId: 'contributors',
    type: 'public',
    name: 'UI Redesign',
  },
  { id: 'orion', teamId: 'contributors', type: 'public', name: 'Orion' },
  {
    id: 'release-discussion',
    teamId: 'contributors',
    type: 'public',
    name: 'Release Discussion',
  },
  {
    id: 'calling-eng',
    teamId: 'contributors',
    type: 'public',
    name: 'Calling Eng',
  },
  {
    id: 'customer-onboarding',
    teamId: 'contributors',
    type: 'private',
    name: 'Customer Onboarding',
  },
  {
    id: 'product-support',
    teamId: 'contributors',
    type: 'private',
    name: 'Product Support',
  },
  {
    id: 'dm-aiko-tan',
    teamId: 'contributors',
    type: 'direct',
    name: 'Aiko Tan',
    memberIds: ['leonard-riley', 'aiko-tan'],
  },
  {
    id: 'dm-arjun-patel',
    teamId: 'contributors',
    type: 'direct',
    name: 'Arjun Patel',
    memberIds: ['leonard-riley', 'arjun-patel'],
  },
  {
    id: 'gm-design-leads',
    teamId: 'contributors',
    type: 'group',
    name: 'Danielle Okoro, Darius Cole',
    memberIds: ['leonard-riley', 'danielle-okoro', 'darius-cole'],
  },
];

export function getFixtureChannel(id: string): FixtureChannel | undefined {
  return fixtureChannels.find((c) => c.id === id);
}
