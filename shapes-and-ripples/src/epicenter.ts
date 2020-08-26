/**
 * Epicenter.
 */

import { canvas } from "./common";

export interface Unit {
  x: number;
  y: number;
  radius: number;
}

export const create = (x: number, y: number): Unit => ({
  x,
  y,
  radius: 0.0,
});

export const radiusChangeRate = 12;

export const update = (unit: Unit): boolean => {
  unit.radius += radiusChangeRate;

  const canvasSize = canvas.logicalSize;
  const dead = Math.max(canvasSize.width, canvasSize.height) < unit.radius;

  return !dead;
};
