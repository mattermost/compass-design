import styles from '@/styles/library-demo/foundations.module.scss';

interface Radius {
  token: string;
  value: string;
  deprecated?: string;
}

const RADII: Radius[] = [
  { token: '--radius-xs', value: '2px' },
  { token: '--radius-s', value: '4px' },
  { token: '--radius-m', value: '8px' },
  { token: '--radius-l', value: '12px' },
  { token: '--radius-xl', value: '16px' },
  { token: '--radius-pill', value: '9999px' },
  {
    token: '--radius-full',
    value: '9999px',
    deprecated:
      'Deprecated — use --radius-pill. Mattermost webapp defines --radius-full as 50%, which wins when embedded and turns pills into ellipses.',
  },
];

export function ShapeRadiiContent() {
  return (
    <div className={styles['foundations__shape-rows']}>
      {RADII.map(({ token, value, deprecated }) => (
        <div key={token} className={styles['foundations__shape-row']}>
          <code className={styles['foundations__shape-token']}>{token}</code>
          <span className={styles['foundations__shape-value']}>{value}</span>
          <div className={styles['foundations__shape-preview']}>
            <div
              className={styles['foundations__shape-box']}
              style={{ borderRadius: `var(${token})` }}
            />
          </div>
          {deprecated && (
            <span className={styles['foundations__shape-note']}>
              {deprecated}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ShapeLibrary() {
  return <ShapeRadiiContent />;
}
