/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { pauseOrResume, cielchColor, setShadow } from "@fal-works/p5-extension";
import { p, canvas, Random } from "./common";

// ---- reset & initialize ----
const createColors = (baseHue?: number) => {
  const hue = baseHue || Random.angle();
  const lightness = Random.between(50, 100);

  return {
    stroke: cielchColor(lightness, 110, hue, 0.8 * 255),
    shadow: cielchColor(lightness, 110, hue, 0.5 * 255),
  };
};

const drawRandomShape = (x: number, y: number, baseHue: number): void => {
  const colors = createColors(baseHue);

  p.push();
  p.stroke(colors.stroke);
  p.noFill();
  setShadow(colors.shadow, 16, 15, 20);

  p.rect(x, y, 100, 100);

  p.pop();
};

const drawSketch = (): void => {
  p.blendMode(p.REPLACE);
  p.background(252);
  p.blendMode(p.MULTIPLY);

  const { width, height } = canvas.logicalSize;

  p.push();

  const interval = Random.between(50, 100);
  for (let x = 100; x < width - 100; x += interval) {
    for (let y = 100; y < height - 100; y += interval) {
      drawRandomShape(x, y, Random.angle());
    }
  }

  p.pop();
};

export const reset = (): void => {
  canvas.drawScaled(drawSketch);
};

export const initialize = (): void => {
  p.rectMode(p.CENTER);
  p.strokeWeight(8);

  reset();
};

// ---- UI ----

const mousePressed = () => reset();

const keyTyped = () => {
  switch (p.key) {
    case "p":
      pauseOrResume();
      break;
    case "g":
      p.save("image.png");
      break;
    case "r":
      reset();
      break;
  }

  return false;
};

// ---- p5 methods ----

export const p5Methods = {
  keyTyped,
  mousePressed,
};
