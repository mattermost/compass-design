import { ProductRail, ProductRailTeamButton } from '@mattermost/compass-proto';
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
        />
      </div>
    </AnatomyStage>
  );
}
