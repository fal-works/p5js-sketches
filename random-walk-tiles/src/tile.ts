import { p, HSV, Random, Numeric, Easing, context } from "./common";

export const size = 36;
const drawSize = 28;
const radius = 4;
const easeAlpha = Easing.concatenate(
  (v) => Numeric.square(v),
  (v) => 1 - Numeric.cube(v),
  0.15
);

export interface Unit {
  x: number;
  y: number;
  hue: number;
  rgb: readonly number[];
  progress: number;
  progressRate: number;
}

export const create = (x: number, y: number, hue: number): Unit => {
  return {
    x,
    y,
    hue,
    rgb: HSV.toRGB([
      (hue + Random.Curved.signed(Numeric.cube, 150) + 360) % 360,
      0.8,
      0.98,
    ]).map((v) => 255 * v),
    progress: 0,
    progressRate: 0.01,
  };
};

export const update = (tile: Unit): boolean => {
  const nextProgress = tile.progress + tile.progressRate;

  if (nextProgress >= 1) return true;
  else {
    tile.progress = nextProgress;
    return false;
  }
};

export const draw = (tile: Unit): void => {
  const { rgb } = tile;
  const alpha = 192 * easeAlpha(tile.progress);
  const color = p.color(rgb[0], rgb[1], rgb[2], alpha);
  p.fill(color);
  context.shadowColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.2 * alpha})`;
  p.rect(tile.x, tile.y, drawSize, drawSize, radius);
};
