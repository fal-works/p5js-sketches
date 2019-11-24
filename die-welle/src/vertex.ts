/**
 * ---- Vertex ----------------------------------------------------------------
 */

import {
  square,
  sin,
  createNumericMap,
  p,
  Noise,
  width,
  LEFT_X
} from "./common";

export interface Unit {
  x: number;
  y: number;
  noiseX: () => number;
  noiseY: () => number;
}

export const create = (
  x: number,
  y: number,
  noiseOffsetX?: number,
  noiseOffsetY?: number
): Unit => {
  return {
    x,
    y,
    noiseX: Noise.withChangeRate(0.008, noiseOffsetX),
    noiseY: Noise.withChangeRate(0.008, noiseOffsetY)
  };
};

export const update = (vertex: Unit) => {
  vertex.x -= 4;
  return vertex.x <= LEFT_X;
};

const xToRadians = createNumericMap(0, width, 0, Math.PI);
const yFactor = (x: number) =>
  x > 0 && x < width ? square(sin(xToRadians(x))) : 0;
const noiseAverage = Noise.AVERAGE;

export const draw = (vertex: Unit) => {
  const x = vertex.x + 140 * (vertex.noiseX() - noiseAverage);
  const y = vertex.y + 140 * (vertex.noiseY() - noiseAverage);
  p.curveVertex(x, yFactor(x) * y);
};
