/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { pauseOrResume } from "@fal-works/p5-extension";
import { p, canvas, resetCommon, Numeric, Arrays } from "./common";

import p5 from "p5";

// ---- variables | functions ----
let photo: p5.Image;
let originalPixels: number[];
let x: number[];
let time = 0;

// ---- reset & initialize ----
const preload = () => {
  photo = p.loadImage("photo.jpg"); // eslint-disable-line
};

export const reset = () => {
  canvas.drawScaled(() => {
    p.image(photo, 0, 0);
  });

  p.loadPixels();
  originalPixels = p.pixels.slice();
  x = Arrays.createIntegerSequence(Numeric.ceil(p.width));

  resetCommon();
};

export const initialize = (): void => {
  p.pixelDensity(1);
  p.frameRate(30);
  reset();
};

// ---- draw ----
const noise = (rowOffset: number, time: number, x: number) =>
  -0.5 + p.noise(rowOffset + time + x * 0.005);

const draw = (): void => {
  const { floor } = Numeric;
  const { pixels, width, frameCount } = p;
  const totalLength = pixels.length;
  const indicesPerRow = width * 4;
  const editLength = totalLength - indicesPerRow;

  const timeScale = 0.3 * Numeric.cube(p.noise(frameCount * 0.03));
  time += timeScale;

  let index = 0;
  let y = 0;

  // first row
  while (index < indicesPerRow) {
    pixels[index] = originalPixels[index++];
    pixels[index] = originalPixels[index++];
    pixels[index] = originalPixels[index];
    index += 2;
  }
  y += 1;

  // middle rows
  let row = -1;
  let indexOffset: number[] = [];
  while (index < editLength) {
    const newRow = y >> 2;
    if (row != newRow) {
      row = newRow;
      const noiseFactor = Numeric.pow4(p.noise(0.05 * row + time));
      indexOffset = x.map(
        (x) => floor(noiseFactor * 0.65 * noise(row, time, x) * width) << 2
      );
    }

    for (let x = 0; x < width; x += 1) {
      const sourceIndex = index + indexOffset[x];
      pixels[index] = originalPixels[sourceIndex];
      pixels[index + 1] = originalPixels[sourceIndex + 1];
      pixels[index + 2] = originalPixels[sourceIndex + 2];
      index += 4;
    }
    y += 1;
  }

  // last row
  while (index < totalLength) {
    pixels[index] = originalPixels[index++];
    pixels[index] = originalPixels[index++];
    pixels[index] = originalPixels[index];
    index += 2;
  }

  p.updatePixels();
};

// ---- UI ----

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
  draw,
  keyTyped,
  preload,
};
