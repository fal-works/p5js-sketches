import { onSetup, p } from "@fal-works/p5-extension";

import p5 from "p5";

const SIZE = 180;
const NOISE_SCALE = 0.0075;
const MIN_TIME_SCALE = 0.02;
const TIME_SCALE_DECAY = 0.92;
let time = 1000 * Math.random();
let timeScale = MIN_TIME_SCALE;
let g: p5.Graphics;

export const impact = () => {
  timeScale = 0.2;
};

export const update = () => {
  g.clear();
  g.noStroke();
  g.fill(255, 32);

  const w = g.width;
  const h = g.height;

  const startX = 0.25 * w;
  const startY = 0.25 * h;
  const endX = 0.75 * w;
  const endY = 0.75 * h;

  for (let x = startX; x < endX; x += 1) {
    for (let y = startY; y < endY; y += 1) {
      const offsetMag = 0.5 * SIZE;
      const noiseFactor =
        p.noise(time + NOISE_SCALE * x) + p.noise(-time + NOISE_SCALE * y) - 1;
      const radius = offsetMag * noiseFactor;
      const angle = 2 * Math.PI * noiseFactor;

      g.circle(x + radius * Math.cos(angle), y + radius * Math.sin(angle), 4);
    }
  }

  time += timeScale;
  timeScale = Math.max(MIN_TIME_SCALE, timeScale * TIME_SCALE_DECAY);
};

onSetup.push(() => {
  g = p.createGraphics(SIZE, SIZE);
  update();
});

export const draw = () => {
  p.imageMode(p.CENTER);
  const adjust = -0.1 * SIZE;
  p.image(g, adjust, adjust);
};
