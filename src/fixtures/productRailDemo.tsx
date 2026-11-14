import BookOutlineIcon from '@mattermost/compass-icons/components/book-outline';
import CreationOutlineIcon from '@mattermost/compass-icons/components/creation-outline';
import LightningBoltOutlineIcon from '@mattermost/compass-icons/components/lightning-bolt-outline';
import ProductBoardsIcon from '@mattermost/compass-icons/components/product-boards';
import ProductChannelsIcon from '@mattermost/compass-icons/components/product-channels';
import ProductPlaybooksIcon from '@mattermost/compass-icons/components/product-playbooks';
import type { ProductRailItemData } from '@mattermost/compass-proto';

export type ProductRailDemoId =
  | 'channels'
  | 'boards'
  | 'playbooks'
  | 'agents'
  | 'docs'
  | 'automation';

/** Product Rail items shared by the docs anatomy stage, specimen, and Product layout. */
export const productRailDemoItems: (ProductRailItemData & {
  id: ProductRailDemoId;
})[] = [
  {
    id: 'channels',
    label: 'Channels',
    icon: <ProductChannelsIcon size={20} />,
    unreadBadge: true,
  },
  {
    id: 'boards',
    label: 'Boards',
    icon: <ProductBoardsIcon size={20} />,
  },
  {
    id: 'playbooks',
    label: 'Playbooks',
    icon: <ProductPlaybooksIcon size={20} />,
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
    icon: <BookOutlineIcon size={20} />,
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: <LightningBoltOutlineIcon size={20} />,
  },
];
