/**
 * ---- Common math utility --------------------------------------------------
 */

export const sq = (v: number) => v * v;

export const cubic = (v: number) => v * v * v;

export const TWO_PI = 2 * Math.PI;

export const createAngleArray = (resolution: number): readonly number[] => {
  const array: number[] = new Array(resolution);
  const interval = TWO_PI / resolution;
  for (let i = 0; i < resolution; i += 1) array[i] = i * interval;

  return array;
};

export const nearlyEqual = (a: number, b: number): boolean =>
  Math.abs(a - b) < 0.0000000000001;
