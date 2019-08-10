/**
 * -----------------------------------------------------------------------------
 * @module common/ds/vector-2d
 */

undefined;

/**
 * A readonly 2D vector.
 */
export interface Vector2D {
  readonly x: number;
  readonly y: number;
}

/**
 * Creates a new vector by adding two vectors.
 * @param a
 * @param b
 * @return new `Vector2D`.
 */
export const add = (a: Vector2D, b: Vector2D): Vector2D => {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
};

/**
 * Creates a new vector from polar coordinates `angle` and `length`.
 * @param angle
 * @param length
 * @return new `Vector2D`.
 */
export const fromPolar = (angle: number, length: number): Vector2D => {
  return {
    x: length * Math.cos(angle),
    y: length * Math.sin(angle)
  };
};

/**
 * Creates a new vector by adding polar coordinates `angle` and `length`.
 * @param vector
 * @param angle
 * @param length
 * @return new `Vector2D`.
 */
export const addPolar = (
  vector: Vector2D,
  angle: number,
  length: number
): Vector2D => {
  return {
    x: vector.x + length * Math.cos(angle),
    y: vector.y + length * Math.sin(angle)
  };
};
