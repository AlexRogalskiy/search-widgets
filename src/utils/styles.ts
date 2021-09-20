/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNumber, isObject, isString } from 'lodash-es';

// The container size breakpoints (based on Tailwind config)
export const breakpoints: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

type BreakpointKeys = keyof typeof breakpoints;
export type Breakpoints = Record<BreakpointKeys, boolean | null>;

/**
 * Determine the current breakpoints based on width
 * @param width - Number
 */
export function parseBreakpoints(width: number): Breakpoints {
  return Object.entries(breakpoints).reduce(
    (out, [key, min]) => ({
      ...out,
      [key]: width > 0 ? width >= min : null,
    }),
    {},
  ) as Breakpoints;
}

/**
 * Get the computed style for an element by injecting an element into the body to get it's styles
 * @param property - The style property
 * @param element - The type of element - e.g. 'span'
 * @param classNames - Any classNames to add to the element
 */
export function getComputedStyleForElement(property: string, element = 'span', classNames?: string[]) {
  // Create test element
  const test: HTMLElement = document.createElement(element);

  // Add classname
  if (classNames) {
    test.classList.add(...classNames);
  }

  // Inject to body
  document.body.appendChild(test);

  // Get the styles
  const styles = getComputedStyle(test);

  // Clean up
  document.body.removeChild(test);

  // Return the desired property
  return styles.getPropertyValue(property);
}

export const parseRatio = (input: string) => {
  if (!input.includes('/')) {
    return parseInt(input, 10);
  }

  const [x, y] = input.split('/').map((i) => parseInt(i.trim(), 10));
  return x / y;
};

export function mapAspectRatio(aspectRatio?: any) {
  if (isNumber(aspectRatio)) {
    return aspectRatio;
  }

  if (isString(aspectRatio)) {
    return parseRatio(aspectRatio);
  }

  if (isObject(aspectRatio)) {
    return Object.entries(aspectRatio ?? {}).reduce(
      (current, [key, value]) =>
        Object.assign(current, { [key]: isString(value) ? parseRatio(value) : (value as number) }),
      aspectRatio,
    ) as Record<string, number>;
  }

  return undefined;
}
