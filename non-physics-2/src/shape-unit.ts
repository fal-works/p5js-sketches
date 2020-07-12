/**
 * ---- Shape unit -------------------------------------------------------------
 */

import { p, drawTransformed, ShapeColor, Random } from "./common";
import * as p5ex from "@fal-works/p5-extension";

export interface Unit {
  readonly x: number;
  readonly y: number;
  readonly clockwise: boolean;
  readonly color: p5ex.ShapeColor.Unit;
  readonly drawShape: () => void;
}

const rectangle = () => {
  const width = Random.between(40, 90);
  const height = Random.between(40, 90);
  return () => p.rect(0, 0, width, height);
};

const triangle = () => {
  const size = Random.between(40, 80);
  switch (Random.Integer.value(4)) {
    case 0:
      return () => p.triangle(0, 0, 0, size, size, size);
    case 1:
      return () => p.triangle(0, 0, size, 0, 0, size);
    case 2:
      return () => p.triangle(0, 0, size, 0, size, size);
    case 3:
      return () => p.triangle(0, size, size, size, size, 0);
    default:
      throw "Unexpected value.";
  }
};

export const create = (
  x: number,
  y: number,
  clockwise: boolean,
  color: p5ex.ShapeColor.Unit
): Unit => ({
  x,
  y,
  clockwise,
  color,
  drawShape: Math.random() < 0.5 ? rectangle() : triangle(),
});

export const draw = (unit: Unit, visibility: number): void => {
  const { x, y, clockwise, color, drawShape } = unit;

  ShapeColor.apply(color, visibility * 255.0);

  const angle = (clockwise ? 1.0 : -1.0) * visibility * 4.0 * Math.PI;
  drawTransformed(drawShape, x, y, angle, visibility);
};
