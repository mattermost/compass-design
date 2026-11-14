import { useState } from 'react';
import ProductChannelsIcon from '@mattermost/compass-icons/components/product-channels';
import ProductPlaybooksIcon from '@mattermost/compass-icons/components/product-playbooks';
import ProductBoardsIcon from '@mattermost/compass-icons/components/product-boards';
import { ProductRail } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function ProductRailLibrary() {
  const [activeId, setActiveId] = useState('channels');
  return (
    <div className={styles['patterns__product-rail-demo']}>
      <ProductRail
        activeId={activeId}
        onSelect={setActiveId}
        items={[
          {
            id: 'channels',
            label: 'Channels',
            icon: <ProductChannelsIcon size={20} />,
            unreadBadge: true,
          },
          {
            id: 'playbooks',
            label: 'Playbooks',
            icon: <ProductPlaybooksIcon size={20} />,
            mentionBadge: 3,
          },
          {
            id: 'boards',
            label: 'Boards',
            icon: <ProductBoardsIcon size={20} />,
          },
        ]}
      />
    </div>
  );
}
