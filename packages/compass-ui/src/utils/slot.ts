import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefCallback,
} from 'react';
import { mergeClassNames } from '@/utils/props';

type PossibleRef<T> = Ref<T> | undefined;

/** Assigns a value to a callback or object ref. */
function setRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref != null) {
    (ref as { current: T | null }).current = value;
  }
}

/** Composes multiple refs into a single callback ref. */
export function composeRefs<T>(...refs: Array<PossibleRef<T>>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      setRef(ref, node);
    }
  };
}

/**
 * Reads the ref from a React element across React 18 (`element.ref`) and
 * React 19 (`element.props.ref`).
 */
export function getElementRef(element: ReactElement): Ref<unknown> | undefined {
  // React 19: ref is a regular prop. React 18: ref is on the element.
  const propsRef = (element.props as { ref?: Ref<unknown> } | null | undefined)
    ?.ref;
  if (propsRef !== undefined) {
    return propsRef;
  }
  return (element as ReactElement & { ref?: Ref<unknown> }).ref;
}

type AnyProps = Record<string, unknown>;

function isHandlerKey(key: string): boolean {
  return (
    key.length > 2 && key.startsWith('on') && key[2] === key[2]?.toUpperCase()
  );
}

/**
 * Merges Slot (asChild host) props with the child's props.
 * Child props win by default; event handlers are composed (child first;
 * host skipped when the child called `preventDefault()`); `className` and
 * `style` are merged.
 */
export function mergeSlotProps(
  slotProps: AnyProps,
  childProps: AnyProps,
): AnyProps {
  const override: AnyProps = { ...childProps };

  for (const propName of Object.keys(slotProps)) {
    const slotValue = slotProps[propName];
    const childValue = childProps[propName];

    if (isHandlerKey(propName)) {
      if (typeof slotValue === 'function' && typeof childValue === 'function') {
        override[propName] = (...args: unknown[]) => {
          const event = args[0] as { defaultPrevented?: boolean } | undefined;
          childValue(...args);
          if (!event?.defaultPrevented) {
            slotValue(...args);
          }
        };
      } else if (typeof slotValue === 'function') {
        override[propName] = slotValue;
      }
    } else if (propName === 'style') {
      override.style = {
        ...(typeof slotValue === 'object' && slotValue != null
          ? (slotValue as CSSProperties)
          : null),
        ...(typeof childValue === 'object' && childValue != null
          ? (childValue as CSSProperties)
          : null),
      };
    } else if (propName === 'className') {
      override.className = mergeClassNames(
        typeof slotValue === 'string' ? slotValue : undefined,
        typeof childValue === 'string' ? childValue : undefined,
      );
    } else if (!(propName in childProps)) {
      override[propName] = slotValue;
    }
  }

  return override;
}

function hasRenderableChildren(children: ReactNode): boolean {
  if (children == null || children === false || children === true) {
    return false;
  }
  if (typeof children === 'string') {
    return children.length > 0;
  }
  if (Array.isArray(children)) {
    return children.some(hasRenderableChildren);
  }
  return true;
}

function blockNavigation(event: {
  preventDefault: () => void;
  stopPropagation: () => void;
}) {
  event.preventDefault();
  event.stopPropagation();
}

export interface RenderAsChildOptions {
  /** Single React element to clone (e.g. `<a>` or `<Link>`). */
  child: ReactNode;
  /** Props owned by the host component (className, handlers, aria-*, …). */
  props: AnyProps;
  /** Forwarded ref from the host. */
  ref?: Ref<unknown>;
  /** Anatomy nodes that replace the child's children. */
  content: ReactNode;
  /** When true, apply disabled-link semantics. */
  disabled?: boolean;
  /** BEM disabled class (e.g. `button--disabled`). */
  disabledClassName?: string;
  /**
   * When true, warn in development if the child already has children (they
   * will be replaced). Use for hosts that own their full anatomy
   * (IconButton, TileButton). Leave false when the host wraps the child's
   * text (Button label).
   */
  warnOnChildContent?: boolean;
}

/**
 * Clones a single child element with merged host props, composed refs, and
 * replacement content. Never forwards `type`. When `disabled`, sets
 * `aria-disabled`, the disabled class, and blocks click / auxclick navigation.
 */
export function renderAsChild({
  child,
  props,
  ref,
  content,
  disabled = false,
  disabledClassName,
  warnOnChildContent = false,
}: RenderAsChildOptions): ReactElement | null {
  const warn = process.env.NODE_ENV !== 'production';

  let onlyChild: ReactNode = null;
  try {
    onlyChild = Children.only(child);
  } catch {
    onlyChild = null;
  }

  if (!isValidElement(onlyChild)) {
    if (warn) {
      console.warn(
        'asChild expects a single React element child (e.g. <a> or <Link>).',
      );
    }
    return null;
  }

  const childProps = onlyChild.props as AnyProps & { children?: ReactNode };

  if (
    warn &&
    warnOnChildContent &&
    hasRenderableChildren(childProps.children)
  ) {
    console.warn(
      'asChild replaces the child element\'s children with component anatomy. Pass an empty element (e.g. <a href="…" />).',
    );
  }

  // Strip `type` — on <a> it means MIME type, not button type.
  const slotProps: AnyProps = { ...props };
  delete slotProps.type;

  if (disabled) {
    slotProps['aria-disabled'] = true;
    if (disabledClassName) {
      slotProps.className = mergeClassNames(
        typeof slotProps.className === 'string'
          ? slotProps.className
          : undefined,
        disabledClassName,
      );
    }
  }

  const merged = mergeSlotProps(slotProps, childProps);

  if (disabled) {
    merged.onClick = blockNavigation;
    merged.onAuxClick = blockNavigation;
  }

  const childRef = getElementRef(onlyChild);

  return cloneElement(onlyChild, {
    ...merged,
    ref: composeRefs(ref, childRef),
    children: content,
  } as AnyProps);
}
