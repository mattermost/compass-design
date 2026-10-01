import { lazy, Suspense, useState } from 'react';
import type { LazyExoticComponent } from 'react';
import { Switch } from '@mattermost/compass-ui/components/switch';
import {
  COMPASS_ICON_CODES,
  COMPASS_ICON_LOADERS,
  type CompassSvgIcon,
} from './compassIconImports.generated';
import styles from '@/styles/library-demo/foundations.module.scss';

const lazyIconByGlyph = new Map<string, LazyExoticComponent<CompassSvgIcon>>();

for (const [glyph, loader] of Object.entries(COMPASS_ICON_LOADERS)) {
  lazyIconByGlyph.set(glyph, lazy(loader));
}

const SORTED_GLYPHS = [...lazyIconByGlyph.keys()].sort((a, b) =>
  a.localeCompare(b),
);

function formatCodepoint(code: number): string {
  return `0x${code.toString(16)}`;
}

export function IconographyGridContent() {
  const [showCodes, setShowCodes] = useState(false);

  if (SORTED_GLYPHS.length === 0) {
    return <p>No icons could be loaded from the Compass Icons package.</p>;
  }

  return (
    <Suspense fallback={<p>Loading icons…</p>}>
      <div className={styles['foundations__icon-library']}>
        <div className={styles['foundations__icon-toolbar']}>
          <Switch
            className={styles['foundations__icon-codes-switch']}
            size="small"
            checked={showCodes}
            onChange={(event) => setShowCodes(event.target.checked)}
          >
            Show codes
          </Switch>
        </div>
        <div className={styles['foundations__icon-grid']}>
          {SORTED_GLYPHS.map((glyph) => {
            const LazyIcon = lazyIconByGlyph.get(glyph);
            if (!LazyIcon) return null;
            const code = COMPASS_ICON_CODES[glyph];
            return (
              <div key={glyph} className={styles['foundations__icon-cell']}>
                <span
                  className={styles['foundations__icon-preview']}
                  aria-hidden
                >
                  <LazyIcon size={24} />
                </span>
                <span className={styles['foundations__icon-token']}>{glyph}</span>
                {showCodes && typeof code === 'number' ? (
                  <span className={styles['foundations__icon-code']}>
                    {formatCodepoint(code)}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Suspense>
  );
}

export default function IconographyLibrary() {
  return <IconographyGridContent />;
}
