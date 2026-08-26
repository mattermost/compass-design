import GlobeIcon from '@mattermost/compass-icons/components/globe';
import { Tag } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function TagLibrary() {
  return (
    <>
      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Types</h3>
        <div className={styles['components__row']}>
          <Tag label="default" type="default" />
          <Tag label="Info" type="info" />
          <Tag label="Info Dim" type="info-dim" />
          <Tag label="Danger" type="danger" />
          <Tag label="Success" type="success" />
          <Tag label="Warning" type="warning" />
        </div>
      </div>
      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Sizes</h3>
        <div className={styles['components__row']}>
          <Tag label="default" type="default" size="small" />
          <Tag label="Info" type="info" size="small" />
          <Tag label="Info Dim" type="info-dim" size="small" />
          <Tag label="Danger" type="danger" size="small" />
          <Tag label="Success" type="success" size="small" />
          <Tag label="Warning" type="warning" size="small" />
        </div>
      </div>
      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>All caps</h3>
        <div className={styles['components__row']}>
          <Tag label="Tag" type="default" casing="all-caps" />
          <Tag label="Tag" type="info" casing="all-caps" />
          <Tag label="Tag" type="info-dim" casing="all-caps" />
          <Tag label="Tag" type="danger" casing="all-caps" />
          <Tag label="Tag" type="success" casing="all-caps" />
          <Tag label="Tag" type="warning" casing="all-caps" />
        </div>
      </div>
      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>With icon</h3>
        <div className={styles['components__row']}>
          <Tag
            label="Professional"
            casing="all-caps"
            leadingIcon={<GlobeIcon size={10} />}
            type="default"
          />
          <Tag
            label="Info"
            leadingIcon={<GlobeIcon size={10} />}
            type="info"
          />
          <Tag
            label="Success"
            leadingIcon={<GlobeIcon size={12} />}
            size="small"
            type="success"
          />
        </div>
      </div>
    </>
  );
}
