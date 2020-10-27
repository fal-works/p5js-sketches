/**
 * ---- Point ----------------------------------------------------------------
 */

import { p } from "./common";

const { PI, cos, sin } = Math;
const timeScale = 0.01;
let time = 1024 * Math.random();

export const count = 1000;

export interface Unit {
  index: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

export const tick = () => {
  time += timeScale;
};

export const create = (i: number, x: number, y: number): Unit => ({
  index: i,
  x,
  y,
  targetX: x,
  targetY: y,
});

export const draw = (point: Unit): void => {
  const r = 10;
  const theta = time;
  const phi = 2 * PI * (point.index / count);

  const x = r * sin(theta) * cos(phi);
  const y = r * sin(theta) * sin(phi);
  const z = r * cos(theta);

  const size = 4 + 20 * p.noise(x, y, z);

  p.circle(point.x, point.y, size);
};

export const update = (point: Unit): void => {
  point.x += 0.1 * (point.targetX - point.x);
  point.y += 0.1 * (point.targetY - point.y);
};
