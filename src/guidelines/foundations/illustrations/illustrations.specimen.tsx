import { lazy, Suspense } from 'react';
import type { LazyExoticComponent } from 'react';
import { Illustration } from '@mattermost/compass-ui/components/illustration';
import {
  ILLUSTRATION_LOADERS,
  type CompassIllustration,
} from './illustrationImports.generated';
import styles from '@/styles/library-demo/foundations.module.scss';

const lazyByName = new Map<string, LazyExoticComponent<CompassIllustration>>();

for (const [name, loader] of Object.entries(ILLUSTRATION_LOADERS)) {
  lazyByName.set(name, lazy(loader));
}

const SORTED_NAMES = [...lazyByName.keys()].sort((a, b) => a.localeCompare(b));

export function IllustrationsGridContent() {
  if (SORTED_NAMES.length === 0) {
    return <p>No illustrations could be loaded from Compass UI.</p>;
  }

  return (
    <Suspense fallback={<p>Loading illustrations…</p>}>
      <div className={styles['foundations__illustration-library']}>
        <div className={styles['foundations__illustration-grid']}>
          {SORTED_NAMES.map((name) => {
            const LazySvg = lazyByName.get(name);
            if (!LazySvg) return null;
            return (
              <div key={name} className={styles['foundations__illustration-cell']}>
                <span
                  className={styles['foundations__illustration-preview']}
                  aria-hidden
                >
                  <Illustration aria-label="" width="140px" height="96px">
                    <LazySvg />
                  </Illustration>
                </span>
                <span className={styles['foundations__illustration-token']}>
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Suspense>
  );
}

export default function IllustrationsLibrary() {
  return <IllustrationsGridContent />;
}
