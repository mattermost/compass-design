import CogOutlineIcon from '@mattermost/compass-icons/components/cog-outline';
import {
  ProductRail,
  ProductRailTeamButton,
  WithTooltip,
} from '@mattermost/compass-proto';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import {
  productRailDemoItems,
  productRailDemoTeams,
} from '@/fixtures/productRailDemo';
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
              teams={productRailDemoTeams}
            />
          }
          activeId="channels"
          items={productRailDemoItems}
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
