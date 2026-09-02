import type { ChannelsSidebarItemModel, ChannelsSidebarGroupModel, ChannelsSidebarModel } from '@mattermost/compass-ui/components/channels-sidebar';

export interface BuildDefaultChannelsSidebarModelInput {
  showUnreadsCategory: boolean;
  /** When true, appends "dial-pad" to the top group (Threads / Drafts row). */
  showDialPad?: boolean;
  avatarAikoTan: string;
  avatarArjunPatel: string;
  avatarDanielleOkoro: string;
  avatarDariusCole: string;
  avatarDavidLiang: string;
  avatarEmmaNovak: string;
  avatarEthanBrooks: string;
}

/** Builds the canonical playground sidebar tree (matches pre-model hardcoded markup). */
export function buildDefaultChannelsSidebarModel(
  input: BuildDefaultChannelsSidebarModelInput,
): ChannelsSidebarModel {
  const {
    showUnreadsCategory,
    showDialPad = false,
    avatarAikoTan,
    avatarArjunPatel,
    avatarDanielleOkoro,
    avatarDariusCole,
    avatarDavidLiang,
    avatarEmmaNovak,
    avatarEthanBrooks,
  } = input;

  const topGroupItems: ChannelsSidebarItemModel[] = [
    { name: 'Threads', leadingVisual: 'threads' },
    {
      name: 'Drafts',
      leadingVisual: 'drafts',
      status: 'mention',
      mentionCount: 1,
    },
  ];
  if (showDialPad) {
    topGroupItems.push({ name: 'Dial Pad', leadingVisual: 'dial-pad' });
  }

  const groups: ChannelsSidebarGroupModel[] = [];

  if (showUnreadsCategory) {
    groups.push({
      key: 'unreads',
      category: { label: 'Unreads', showChevron: false },
      items: [
        { name: 'UX Design', leadingVisual: 'public', active: true },
        { name: 'Orion', leadingVisual: 'public', status: 'unread' },
        {
          name: 'Release Discussion',
          leadingVisual: 'public',
          status: 'unread',
        },
        {
          name: 'Customer Onboarding',
          leadingVisual: 'private',
          status: 'unread',
        },
        { name: 'Race Teams', leadingVisual: 'private', status: 'unread' },
        {
          name: 'Arjun Patel',
          leadingVisual: 'direct-message',
          status: 'mention',
          mentionCount: 1,
          avatarSrc: avatarArjunPatel,
          avatarAlt: 'Arjun Patel',
          showAvatarStatus: true,
        },
        {
          name: 'Danielle Okoro',
          leadingVisual: 'direct-message',
          status: 'mention',
          mentionCount: 1,
          avatarSrc: avatarDanielleOkoro,
          avatarAlt: 'Danielle Okoro',
          showAvatarStatus: true,
        },
      ],
    });
  }

  const favoritesItems: ChannelsSidebarItemModel[] = [
    { name: 'UI Redesign', leadingVisual: 'public' },
  ];
  if (!showUnreadsCategory) {
    favoritesItems.push({
      name: 'UX Design',
      leadingVisual: 'public',
      active: true,
    });
  }
  favoritesItems.push(
    { name: 'Softphone UX', leadingVisual: 'public' },
    {
      name: 'Aiko Tan',
      leadingVisual: 'direct-message',
      avatarSrc: avatarAikoTan,
      avatarAlt: 'Aiko Tan',
      showAvatarStatus: true,
    },
    {
      name: 'Hilda Martin, Steve M...',
      leadingVisual: 'group-message',
      memberCount: 2,
    },
  );

  groups.push({
    key: 'favorites',
    category: { label: 'Favorites' },
    items: favoritesItems,
  });

  const channelsItems: ChannelsSidebarItemModel[] = [
    { name: 'Contributors', leadingVisual: 'public' },
    { name: 'Developers', leadingVisual: 'public' },
  ];
  if (!showUnreadsCategory) {
    channelsItems.push(
      { name: 'Orion', leadingVisual: 'public', status: 'unread' },
      {
        name: 'Release Discussion',
        leadingVisual: 'public',
        status: 'unread',
      },
    );
  }
  channelsItems.push(
    { name: 'Calling Eng', leadingVisual: 'public' },
    { name: 'Security Incident', leadingVisual: 'public' },
    { name: 'Telephony Vendors', leadingVisual: 'private' },
    { name: 'System Status', leadingVisual: 'private' },
    { name: 'Product Support', leadingVisual: 'private' },
  );
  if (!showUnreadsCategory) {
    channelsItems.push(
      { name: 'Sales Partners', leadingVisual: 'private', status: 'unread' },
      {
        name: 'Customer Onboarding',
        leadingVisual: 'private',
        status: 'unread',
      },
    );
  }

  groups.push({
    key: 'channels',
    category: { label: 'channels' },
    items: channelsItems,
  });

  const dmItems: ChannelsSidebarItemModel[] = [
    {
      name: 'Aiko Tan',
      leadingVisual: 'direct-message',
      avatarSrc: avatarAikoTan,
      avatarAlt: 'Aiko Tan',
      showAvatarStatus: true,
    },
  ];
  if (!showUnreadsCategory) {
    dmItems.push(
      {
        name: 'Arjun Patel',
        leadingVisual: 'direct-message',
        status: 'mention',
        mentionCount: 1,
        avatarSrc: avatarArjunPatel,
        avatarAlt: 'Arjun Patel',
        showAvatarStatus: true,
      },
      {
        name: 'Danielle Okoro',
        leadingVisual: 'direct-message',
        status: 'mention',
        mentionCount: 1,
        avatarSrc: avatarDanielleOkoro,
        avatarAlt: 'Danielle Okoro',
        showAvatarStatus: true,
      },
    );
  }
  dmItems.push(
    {
      name: 'Richard McDaniel, P...',
      leadingVisual: 'group-message',
      memberCount: 2,
    },
    {
      name: 'Darius Cole',
      leadingVisual: 'direct-message',
      avatarSrc: avatarDariusCole,
      avatarAlt: 'Darius Cole',
      showAvatarStatus: true,
    },
    {
      name: 'David Liang',
      leadingVisual: 'direct-message',
      avatarSrc: avatarDavidLiang,
      avatarAlt: 'David Liang',
      showAvatarStatus: true,
    },
    {
      name: 'Emma Novak',
      leadingVisual: 'direct-message',
      avatarSrc: avatarEmmaNovak,
      avatarAlt: 'Emma Novak',
      showAvatarStatus: true,
    },
    {
      name: 'Ethan Brooks',
      leadingVisual: 'direct-message',
      avatarSrc: avatarEthanBrooks,
      avatarAlt: 'Ethan Brooks',
      showAvatarStatus: true,
    },
  );

  groups.push({
    key: 'direct-messages',
    category: { label: 'Direct Messages', showPlusButton: true },
    items: dmItems,
  });

  return { topGroupItems, groups };
}
