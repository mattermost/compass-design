import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import styles from './MessageAttachment.module.scss';

export type MessageAttachmentSemanticColor =
  | 'good'
  | 'warning'
  | 'danger'
  | 'info';

/** A semantic color, or any CSS color (e.g. `#FFA500`). */
export type MessageAttachmentColor =
  | MessageAttachmentSemanticColor
  | (string & {});

export interface MessageAttachmentField {
  title: ReactNode;
  value: ReactNode;
  /** Short fields sit side by side; others take a full row. Default: false. */
  short?: boolean;
}

export interface MessageAttachmentAction {
  /** Visible label. */
  label: ReactNode;
  /** Renders a link button that opens in a new tab. Omit to render a plain button. */
  href?: string;
  onClick?: () => void;
}

export interface MessageAttachmentProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children'
> {
  /**
   * Color of the bar on the left edge. `good`, `warning`, `danger` and `info`
   * use the semantic colors; any other string is used as a CSS color. Omit for
   * a neutral bar.
   */
  color?: MessageAttachmentColor;
  /** Text above the card, outside it. */
  pretext?: ReactNode;
  authorName?: ReactNode;
  /** Small image before the author name. */
  authorIconSrc?: string;
  authorHref?: string;
  title?: ReactNode;
  /** Makes the title a link that opens in a new tab. */
  titleHref?: string;
  /** Body text. */
  text?: ReactNode;
  fields?: MessageAttachmentField[];
  /** Full-width image under the fields. */
  imageSrc?: string;
  /** Small image at the top right. */
  thumbSrc?: string;
  /** Alt text for `imageSrc` and `thumbSrc`. Default: empty (decorative). */
  imageAlt?: string;
  actions?: MessageAttachmentAction[];
  footer?: ReactNode;
  /** Small image before the footer text. */
  footerIconSrc?: string;
  /** Accessible name for the card region. Default: the title when it is a string. */
  ariaLabel?: string;
}

const SEMANTIC: readonly string[] = ['good', 'warning', 'danger', 'info'];

/**
 * Message attachment: the card an integration (webhook, bot) posts under a
 * message. A colored bar on the left edge, then optional author, title, body
 * text, a grid of fields, an image, action buttons and a footer. Mirrors the
 * Mattermost / Slack attachment format, so hosts can map `attachments` from a
 * post straight onto these props. Presentational: the host owns what the
 * action buttons do.
 */
export default function MessageAttachment({
  color,
  pretext,
  authorName,
  authorIconSrc,
  authorHref,
  title,
  titleHref,
  text,
  fields = [],
  imageSrc,
  thumbSrc,
  imageAlt = '',
  actions = [],
  footer,
  footerIconSrc,
  ariaLabel,
  className,
  style,
  ...rest
}: MessageAttachmentProps) {
  const semantic = color && SEMANTIC.includes(color) ? color : undefined;
  const barStyle: CSSProperties | undefined =
    color && !semantic
      ? ({ '--message-attachment-color': color } as CSSProperties)
      : undefined;
  const shortFields = fields.filter((f) => f.short);
  const longFields = fields.filter((f) => !f.short);
  const name = ariaLabel ?? (typeof title === 'string' ? title : undefined);

  const author = authorName ? (
    <span className={styles['message-attachment__author']}>
      {authorIconSrc && (
        <img
          className={styles['message-attachment__author-icon']}
          src={authorIconSrc}
          alt=""
        />
      )}
      {authorHref ? (
        <a href={authorHref} target="_blank" rel="noopener noreferrer">
          {authorName}
        </a>
      ) : (
        authorName
      )}
    </span>
  ) : null;

  return (
    <div
      className={[styles['message-attachment'], className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {pretext && (
        <p className={styles['message-attachment__pretext']}>{pretext}</p>
      )}
      <section
        className={[
          styles['message-attachment__card'],
          semantic && styles[`message-attachment__card--${semantic}`],
        ]
          .filter(Boolean)
          .join(' ')}
        style={barStyle}
        aria-label={name}
      >
        <div className={styles['message-attachment__inner']}>
          {author}
          {(title || thumbSrc) && (
            <div className={styles['message-attachment__top']}>
              {title && (
                <p className={styles['message-attachment__title']}>
                  {titleHref ? (
                    <a
                      href={titleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </p>
              )}
              {thumbSrc && (
                <img
                  className={styles['message-attachment__thumb']}
                  src={thumbSrc}
                  alt={imageAlt}
                />
              )}
            </div>
          )}
          {text && (
            <div className={styles['message-attachment__text']}>{text}</div>
          )}
          {shortFields.length > 0 && (
            <div className={styles['message-attachment__fields']}>
              {shortFields.map((f, i) => (
                <Field key={i} field={f} />
              ))}
            </div>
          )}
          {longFields.map((f, i) => (
            <div key={i} className={styles['message-attachment__fields']}>
              <Field field={f} />
            </div>
          ))}
          {imageSrc && (
            <img
              className={styles['message-attachment__image']}
              src={imageSrc}
              alt={imageAlt}
            />
          )}
          {actions.length > 0 && (
            <div className={styles['message-attachment__actions']}>
              {actions.map((a, i) =>
                a.href ? (
                  <Button key={i} asChild emphasis="tertiary" size="small">
                    <a href={a.href} target="_blank" rel="noopener noreferrer">
                      {a.label}
                    </a>
                  </Button>
                ) : (
                  <Button
                    key={i}
                    emphasis="tertiary"
                    size="small"
                    onClick={a.onClick}
                  >
                    {a.label}
                  </Button>
                ),
              )}
            </div>
          )}
          {footer && (
            <p className={styles['message-attachment__footer']}>
              {footerIconSrc && (
                <img
                  className={styles['message-attachment__footer-icon']}
                  src={footerIconSrc}
                  alt=""
                />
              )}
              {footer}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ field }: { field: MessageAttachmentField }) {
  return (
    <div className={styles['message-attachment__field']}>
      <span className={styles['message-attachment__field-label']}>
        {field.title}
      </span>
      <span className={styles['message-attachment__field-value']}>
        {field.value}
      </span>
    </div>
  );
}
