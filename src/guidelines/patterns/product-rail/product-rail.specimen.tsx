import { useState } from 'react';
import ProductChannelsIcon from '@mattermost/compass-icons/components/product-channels';
import ProductPlaybooksIcon from '@mattermost/compass-icons/components/product-playbooks';
import ProductBoardsIcon from '@mattermost/compass-icons/components/product-boards';
import { ProductRail } from '@mattermost/compass-proto';
import { Icon } from '@mattermost/compass-ui/components/icon';
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
            icon: <Icon glyph={<ProductChannelsIcon />} size="24" />,
            unreadBadge: true,
          },
          {
            id: 'playbooks',
            label: 'Playbooks',
            icon: <Icon glyph={<ProductPlaybooksIcon />} size="24" />,
            mentionBadge: 3,
          },
          {
            id: 'boards',
            label: 'Boards',
            icon: <Icon glyph={<ProductBoardsIcon />} size="24" />,
          },
        ]}
      />
    </div>
  );
}
