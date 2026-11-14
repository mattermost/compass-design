import CogOutlineIcon from '@mattermost/compass-icons/components/cog-outline';
import ProductChannelsIcon from '@mattermost/compass-icons/components/product-channels';
import ProductPlaybooksIcon from '@mattermost/compass-icons/components/product-playbooks';
import ProductBoardsIcon from '@mattermost/compass-icons/components/product-boards';
import {
  ProductRail,
  ProductRailTeamButton,
  WithTooltip,
} from '@mattermost/compass-proto';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import patternsStyles from '@/styles/library-demo/patterns.module.scss';

/**
 * Product Rail pattern — anatomy preview on the shared AnatomyStage surface.
 */
export function ProductRailAnatomyStage() {
  return (
    <AnatomyStage>
      <div className={patternsStyles['patterns__product-rail-demo']}>
        <ProductRail
          header={
            <ProductRailTeamButton
              activeTeamId="contributors"
              teams={[
                { id: 'contributors', name: 'Contributors', initials: 'Co' },
                { id: 'design', name: 'Design', initials: 'De', unread: true },
                { id: 'acme', name: 'Acme', initials: 'Ac' },
              ]}
            />
          }
          activeId="channels"
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
          footer={
            <WithTooltip label="Settings" placement="right">
              <IconButton
                size="medium"
                style="inverted"
                icon={<Icon glyph={<CogOutlineIcon />} />}
              />
            </WithTooltip>
          }
        />
      </div>
    </AnatomyStage>
  );
}
