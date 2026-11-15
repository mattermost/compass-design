import { useState } from 'react';
import { ProductRail } from '@mattermost/compass-proto';
import { productRailDemoItems } from '@/fixtures/productRailDemo';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function ProductRailLibrary() {
  const [activeId, setActiveId] = useState('channels');
  return (
    <div className={styles['patterns__product-rail-demo']}>
      <ProductRail
        activeId={activeId}
        onSelect={setActiveId}
        items={productRailDemoItems}
      />
    </div>
  );
}
