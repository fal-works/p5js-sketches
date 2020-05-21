/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels, pauseOrResume } from "@fal-works/p5-extension";
import { p, canvas, resetCommon, Random, context } from "./common";
import * as Tile from "./tile";
import * as Tiles from "./tiles";

// ---- variables | functions ----
let drawBackground: () => void;
let lastTile: Tile.Unit;

// ---- reset & initialize ----
export const reset = () => {
  p.blendMode(p.REPLACE);
  p.background(252);
  drawBackground = storePixels();
  p.blendMode(p.DARKEST);

  resetCommon();
  Tiles.reset();

  const canvasSize = canvas.logicalSize;
  const x = 0.5 * canvasSize.width;
  const y = 0.5 * canvasSize.height;
  lastTile = Tile.create(x, y, Random.value(360));
};

export const initialize = (): void => {
  reset();
  p.noStroke();
  p.rectMode(p.CENTER);

  context.shadowOffsetX = 6;
  context.shadowOffsetY = 6;
  context.shadowBlur = 16;
};

// ---- draw ----

const addNewTile = () => {
  let x = 0;
  let y = 0;
  let horizontal, vertical: number;
  const { width, height } = canvas.logicalSize;
  const minX = 0.1 * width;
  const maxX = 0.9 * width;
  const minY = 0.1 * height;
  const maxY = 0.9 * height;
  let searchingNextPosition = true;

  while (searchingNextPosition) {
    switch (Random.Integer.value(4)) {
      default:
      case 0:
        horizontal = -1;
        vertical = 0;
        break;
      case 1:
        horizontal = 0;
        vertical = -1;
        break;
      case 2:
        horizontal = 1;
        vertical = 0;
        break;
      case 3:
        horizontal = 0;
        vertical = 1;
        break;
    }

    x = lastTile.x + horizontal * Tile.size;
    y = lastTile.y + vertical * Tile.size;

    if (x >= minX && x < maxX && y >= minY && y < maxY)
      searchingNextPosition = false;
  }

  const hue = (lastTile.hue + 2) % 360;

  const nextTile = Tile.create(x, y, hue);
  Tiles.add(nextTile);

  lastTile = nextTile;
};

const updateSketch = () => {
  Tiles.update();
  for (let i = 0; i < 2; i += 1) addNewTile();
};

const drawSketch = () => {
  Tiles.draw();
};

const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
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
};
