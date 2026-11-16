import {
  Message,
  MessageAttachment,
  cyberDefensePosts,
} from '@mattermost/compass-proto';
import { integrationIcons } from '@/fixtures/integrationIcons';
import { toMessageAttachmentProps } from '@/fixtures/messageAttachmentProps';
import styles from '@/styles/library-demo/patterns.module.scss';

const fields = [
  { title: 'Node', value: 'admin panel', short: true },
  { title: 'Type', value: 'Brute force attempt', short: true },
  { title: 'Severity', value: 'Medium', short: true },
];

const examplePosts = [
  'security-alerts-1',
  'security-alerts-2',
  'security-alerts-8',
]
  .map((id) => cyberDefensePosts.find((p) => p.id === id))
  .filter((p) => p !== undefined);

export default function MessageAttachmentLibrary() {
  return (
    <div className={styles['patterns__message-attachment-demo']}>
      <p className={styles['patterns__variant-label']}>Colors</p>
      <MessageAttachment
        color="good"
        title="Deploy succeeded"
        text="Build 2041 is live."
      />
      <MessageAttachment
        color="warning"
        title="Disk usage at 82%"
        text="db-prod-02 is close to its threshold."
      />
      <MessageAttachment
        color="danger"
        title="Ransomware signature detected"
        text="Isolated WS-114 from the network."
      />
      <MessageAttachment
        color="info"
        title="Maintenance window"
        text="Tonight at 22:00 UTC."
      />
      <MessageAttachment
        title="No color"
        text="A neutral bar, for content with no severity."
      />
      <MessageAttachment
        color="#FFA500"
        title="Custom CSS color"
        text="Any CSS color works."
      />

      <p className={styles['patterns__variant-label']}>Full card</p>
      <MessageAttachment
        color="warning"
        pretext="Heads up, new alert from the SIEM:"
        title="Multiple failed login attempts"
        titleHref="https://example.com/alerts/1"
        text="Five failed sign-ins for the same account within two minutes."
        fields={fields}
        actions={[
          { label: 'View alert', href: 'https://example.com/alerts/1' },
          { label: 'Acknowledge', onClick: () => {} },
        ]}
        footer="Security Alerts"
        footerIconSrc={integrationIcons.sentinel}
      />

      <p className={styles['patterns__variant-label']}>
        In a post (from the Cyber Defense HQ fixtures)
      </p>
      {examplePosts.map((post) => (
        <Message
          key={post.id}
          avatarSrc={
            post.webhook ? integrationIcons[post.webhook.iconId] : undefined
          }
          avatarAlt={post.webhook?.displayName ?? post.userId}
          username={post.webhook?.displayName ?? post.userId}
          isBot
          timestamp={post.timestamp}
          showMessageActions={false}
          footer={post.attachments?.map((a, i) => (
            <MessageAttachment key={i} {...toMessageAttachmentProps(a)} />
          ))}
        >
          {post.text.replace(/^#+\s*/, '')}
        </Message>
      ))}

      <p className={styles['patterns__variant-label']}>Narrow (fields stack)</p>
      <div className={styles['patterns__message-attachment-narrow']}>
        <MessageAttachment color="danger" title="Critical" fields={fields} />
      </div>
    </div>
  );
}
