import CreationOutlineIcon from '@mattermost/compass-icons/components/creation-outline';
import LightningBoltOutlineIcon from '@mattermost/compass-icons/components/lightning-bolt-outline';
import {
  BullseyeArrowIcon,
  ClipboardTextOutlineIcon,
  MessageProcessingOutlineIcon,
  BookOpenVariantOutlineIcon,
  type GlobalHeaderProduct,
  type ProductRailItemData,
} from '@mattermost/compass-proto';

/** Demo ids are the Global Header's products, so the specimen can pass them straight to `ProductShell`. */
export type ProductRailDemoId = GlobalHeaderProduct;

/** Product Rail items shared by the docs anatomy stage, specimen, and Product layout. */
export const productRailDemoItems: (ProductRailItemData & {
  id: ProductRailDemoId;
})[] = [
  {
    id: 'channels',
    label: 'Channels',
    icon: <MessageProcessingOutlineIcon size={20} />,
    unreadBadge: true,
  },
  {
    id: 'boards',
    label: 'Boards',
    icon: <BullseyeArrowIcon size={20} />,
  },
  {
    id: 'playbooks',
    label: 'Playbooks',
    icon: <ClipboardTextOutlineIcon size={20} />,
    mentionBadge: 3,
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: <CreationOutlineIcon size={20} />,
  },
  {
    id: 'docs',
    label: 'Docs',
    icon: <BookOpenVariantOutlineIcon size={20} />,
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: <LightningBoltOutlineIcon size={20} />,
  },
];
