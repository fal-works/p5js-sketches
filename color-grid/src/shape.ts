/**
 * ---- Shape -----------------------------------------------------------------
 */

import { p, Random, Noise } from "./common";
import p5 from "p5";

export interface Unit {
  x: number;
  y: number;
  w: number;
  h: number;
  color: p5.Color;
  noiseX: () => number;
  noiseY: () => number;
}

export const create = (x: number, y: number, color: p5.Color): Unit => ({
  x: x + Random.Integer.signed(10),
  y: y + Random.Integer.signed(10),
  w: Random.Integer.between(45, 65),
  h: Random.Integer.between(45, 65),
  color,
  noiseX: Noise.withChangeRate(0.002),
  noiseY: Noise.withChangeRate(0.002),
});

export const update = (shape: Unit): void => {
  shape;
};

export const draw = (shape: Unit, scaleX: number, scaleY: number): void => {
  const { x, y, w, h, color, noiseX, noiseY } = shape;

  p.fill(color);
  p.rect(
    x + 50 * (noiseX() - 0.5),
    y + 50 * (noiseY() - 0.5),
    scaleX * w,
    scaleY * h
  );
};
