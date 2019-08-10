/**
 * -----------------------------------------------------------------------------
 * @module common/data-types
 */

undefined; // dummy code for VSCode to ignore file header

/**
 * Object that has width and height of a rectangle.
 */
export interface RectangleSize {
  readonly width: number;
  readonly height: number;
}

export type ArrayOrValue<T> = T | T[];

/**
 * A range between two numbers.
 */
export interface MutableRange {
  start: number;
  end: number;
}

/**
 * A range between two numbers.
 */
export type Range = Readonly<MutableRange>;
