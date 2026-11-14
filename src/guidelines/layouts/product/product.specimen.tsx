import { useState } from 'react';
import ProductBoardsIcon from '@mattermost/compass-icons/components/product-boards';
import ProductChannelsIcon from '@mattermost/compass-icons/components/product-channels';
import ProductPlaybooksIcon from '@mattermost/compass-icons/components/product-playbooks';
import {
  ChannelHeader,
  ChannelsSidebar,
  Message,
  MessageInput,
  ProductRail,
  ProductShell,
  shellStyles,
} from '@mattermost/compass-proto';
import { EmptyState } from '@mattermost/compass-ui/components/empty-state';
import { MessageSeparator } from '@mattermost/compass-ui/components/message-separator';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import { defaultChannelsSidebarDemoModel } from '@/fixtures/channelsSidebarDemo';

type ProductId = 'channels' | 'playbooks' | 'boards';

export default function ProductLayout() {
  const [product, setProduct] = useState<ProductId>('channels');

  return (
    <ProductShell
      product={product}
      productRail={
        <ProductRail
          activeId={product}
          onSelect={(id) => setProduct(id as ProductId)}
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
              mentionBadge: 2,
            },
            {
              id: 'boards',
              label: 'Boards',
              icon: <ProductBoardsIcon size={20} />,
            },
          ]}
        />
      }
      sidebar={
        product === 'channels' ? (
          <ChannelsSidebar
            teamName="Contributors"
            model={defaultChannelsSidebarDemoModel}
          />
        ) : undefined
      }
    >
      {product === 'channels' ? (
        <>
          <ChannelHeader
            type="channel"
            name="Town Square"
            description="Company-wide announcements and general discussion."
            memberCount={124}
          />
          <div className={shellStyles['channel-shell__messages']}>
            <Scrollbar>
              <div className={shellStyles['channel-shell__messages-list']}>
                <MessageSeparator type="date" label="Today" />
                <Message
                  avatarSrc={avatarSofia}
                  avatarAlt="Sofia Bauer"
                  username="Sofia Bauer"
                  timestamp="9:02 AM"
                >
                  <p className={shellStyles['channel-shell__post-text']}>
                    Morning everyone! Roadmap review is at 10:30 today.
                  </p>
                </Message>
              </div>
            </Scrollbar>
          </div>
          <div className={shellStyles['channel-shell__message-input']}>
            <MessageInput placeholder="Write to Town Square" />
          </div>
        </>
      ) : (
        <EmptyState
          title={product === 'playbooks' ? 'Playbooks' : 'Boards'}
          description="This product has no prototype yet. Its content fills the main area."
        />
      )}
    </ProductShell>
  );
}
