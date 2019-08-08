/**
 * ---- Vector 2D ------------------------------------------------------------
 */

export interface Vector2D {
  readonly x: number;
  readonly y: number;
}

export const addPolar = (vector: Vector2D, angle: number, length: number) => {
  return {
    x: vector.x + length * Math.cos(angle),
    y: vector.y + length * Math.sin(angle)
  };
};
