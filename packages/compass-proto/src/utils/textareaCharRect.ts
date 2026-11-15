/** Box of one character inside a textarea, in viewport coordinates. */
export interface CharRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

// Properties that change where text wraps and how tall a line is.
const MIRRORED_PROPERTIES = [
  'direction',
  'boxSizing',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
] as const;

/**
 * Where the character at `index` sits inside `textarea`, in viewport
 * coordinates (a textarea has no DOM for its text, so it is measured on a
 * hidden mirror with the same wrapping). Follows the textarea's scroll
 * position. Use it to anchor a popup to a trigger character such as `@`.
 */
export function getTextareaCharRect(
  textarea: HTMLTextAreaElement,
  index: number,
): CharRect {
  const doc = textarea.ownerDocument;
  const style = doc.defaultView!.getComputedStyle(textarea);
  const mirror = doc.createElement('div');
  const mirrorStyle = mirror.style as unknown as Record<string, string>;
  const computed = style as unknown as Record<string, string>;
  for (const property of MIRRORED_PROPERTIES) {
    mirrorStyle[property] = computed[property];
  }
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.top = '0';
  mirror.style.left = '-9999px';
  mirror.style.overflow = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.overflowWrap = 'break-word';
  mirror.style.width = `${textarea.offsetWidth}px`;

  const value = textarea.value;
  mirror.textContent = value.slice(0, index);
  const marker = doc.createElement('span');
  // An empty tail still needs a box to measure.
  marker.textContent = value.slice(index, index + 1) || '.';
  mirror.appendChild(marker);
  doc.body.appendChild(mirror);

  const box = textarea.getBoundingClientRect();
  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const borderTop = parseFloat(style.borderTopWidth) || 0;
  const left = box.left + borderLeft + marker.offsetLeft - textarea.scrollLeft;
  const top = box.top + borderTop + marker.offsetTop - textarea.scrollTop;
  const width = marker.offsetWidth;
  const height = marker.offsetHeight;
  mirror.remove();
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}
