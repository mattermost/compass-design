import CreationOutlineIcon from '@mattermost/compass-icons/components/creation-outline';
import LightningBoltOutlineIcon from '@mattermost/compass-icons/components/lightning-bolt-outline';
import {
  BullseyeArrowIcon,
  ClipboardTextOutlineIcon,
  MessageProcessingOutlineIcon,
  BookOpenVariantOutlineIcon,
  type GlobalHeaderProduct,
  type ProductRailItemData,
  type ProductRailTeam,
} from '@mattermost/compass-proto';
import avatarStaffTeam from '@/assets/avatars/Staff Team.png';

/** Demo ids are the Global Header's products, so the specimen can pass them straight to `ProductShell`. */
export type ProductRailDemoId = GlobalHeaderProduct;

/** Product Rail items shared by the docs anatomy stage, specimen, and Product layout. */
export const productRailDemoItems: (ProductRailItemData & {
  id: ProductRailDemoId;
})[] = [
  {
    id: 'channels',
    label: 'Channels',
    icon: <MessageProcessingOutlineIcon size={24} />,
    unreadBadge: true,
  },
  {
    id: 'boards',
    label: 'Boards',
    icon: <BullseyeArrowIcon size={24} />,
  },
  {
    id: 'playbooks',
    label: 'Playbooks',
    icon: <ClipboardTextOutlineIcon size={24} />,
    mentionBadge: 3,
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: <CreationOutlineIcon size={24} />,
  },
  {
    id: 'docs',
    label: 'Docs',
    icon: <BookOpenVariantOutlineIcon size={24} />,
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: <LightningBoltOutlineIcon size={24} />,
  },
];

/**
 * Teams for the Product Rail team button and menu. The current team has an image; the others keep
 * their initials fallback.
 */
export const productRailDemoTeams: ProductRailTeam[] = [
  { id: 'contributors', name: 'Contributors', src: avatarStaffTeam },
  { id: 'design', name: 'Design', initials: 'De', unread: true },
  { id: 'acme', name: 'Acme', initials: 'Ac', mentions: 3 },
];
