import { useState } from 'react';
import {
  FileUpload,
  type FileUploadRejection,
} from '@mattermost/compass-ui/components/file-upload';
import styles from '@/styles/library-demo/components.module.scss';

function Interactive() {
  const [names, setNames] = useState<string[]>([]);
  const [rejections, setRejections] = useState<FileUploadRejection[]>([]);
  return (
    <div style={{ width: 420 }}>
      <FileUpload
        multiple
        accept="image/*"
        maxSize={5 * 1024 * 1024}
        maxFiles={3}
        description="Images up to 5 MB, 3 files"
        onFilesSelected={(files) => {
          setRejections([]);
          setNames(files.map((f) => f.name));
        }}
        onFilesRejected={setRejections}
        message={
          rejections.length > 0
            ? `${rejections.length} file(s) not added: ${rejections
                .map((r) => `${r.file.name} (${r.reason})`)
                .join(', ')}`
            : names.length > 0
              ? `Selected: ${names.join(', ')}`
              : undefined
        }
        messageTone={rejections.length > 0 ? 'error' : 'info'}
      />
    </div>
  );
}

export default function FileUploadLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Variants</span>
        <div style={{ width: 320 }}>
          <FileUpload description="One file" />
        </div>
        <FileUpload variant="button" browseLabel="Upload logo" />
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>States</span>
        <div style={{ width: 240 }}>
          <FileUpload invalid message="Only PDF files." />
        </div>
        <div style={{ width: 240 }}>
          <FileUpload loading />
        </div>
        <div style={{ width: 240 }}>
          <FileUpload disabled />
        </div>
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Validation</span>
        <Interactive />
      </div>
    </div>
  );
}
