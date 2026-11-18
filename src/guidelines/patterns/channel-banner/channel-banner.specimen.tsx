import { ChannelBanner } from '@mattermost/compass-proto';
import TokenBanner from '@/guidelines/_components/TokenBanner';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function ChannelBannerLibrary() {
  return (
    <div className={styles['patterns__channel-banner-demo']}>
      <p className={styles['patterns__variant-label']}>Light background</p>
      <ChannelBanner backgroundColor="#FFF0BA">
        Triage within 15 mins. Escalations and discussions in
        #threat-discussions
      </ChannelBanner>

      <p className={styles['patterns__variant-label']}>
        Colored backgrounds from the color tokens (white text)
      </p>
      <TokenBanner token="--color-blue-500">
        Internal use only. Do not share outside the company.
      </TokenBanner>

      <TokenBanner token="--color-red-500">
        Incident in progress. Updates every 30 minutes.
      </TokenBanner>

      <TokenBanner token="--color-green-700">
        All systems operational.
      </TokenBanner>

      <p className={styles['patterns__variant-label']}>With a link</p>
      <ChannelBanner backgroundColor="#FFF0BA">
        Read the{' '}
        <a
          href="https://example.com/policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          escalation policy
        </a>{' '}
        before posting.
      </ChannelBanner>

      <p className={styles['patterns__variant-label']}>
        Text that does not fit (hover for the full text)
      </p>
      <div className={styles['patterns__channel-banner-narrow']}>
        <ChannelBanner backgroundColor="#FFF0BA">
          Triage within 15 mins. Escalations and discussions in
          #threat-discussions
        </ChannelBanner>
      </div>

      <p className={styles['patterns__variant-label']}>
        No text (nothing is shown)
      </p>
      <ChannelBanner backgroundColor="#FFF0BA" />
    </div>
  );
}
