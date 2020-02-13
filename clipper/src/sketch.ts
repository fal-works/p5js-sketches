/**
 * ---- Sketch ----------------------------------------------------------------
 */

import p5 from "p5";
import { storePixels } from "@fal-works/p5-extension";
import {
  p,
  canvas,
  renderer,
  setRenderer,
  resetCommon,
  TWO_PI
} from "./common";
import { assetPath } from "./settings";
import * as Cone from "./cone";

// ---- variables | functions ----
let coloredImage: p5.Image;
let surfaceImage: p5.Image;
let surfaceGraphics: p5.Graphics;
let drawBackground: () => void;
let restoreSurface: () => void;
const cones: Cone.Unit[] = [];

// ---- reset & initialize ----
export const preload = (p: p5) => {
  coloredImage = p.loadImage(`${assetPath}colored-image.jpg`);
  surfaceImage = p.loadImage(`${assetPath}surface-image.jpg`);
};

const resetSurfaceGraphics = () => {
  const g = p.createGraphics(
    canvas.logicalSize.width,
    canvas.logicalSize.height
  );
  g.image(surfaceImage, 0, 0);
  restoreSurface = storePixels(g);
  g.translate(canvas.logicalCenterPosition.x, canvas.logicalCenterPosition.y);
  g.strokeWeight(4);

  surfaceGraphics = g;
};

export const reset = () => {
  p.image(coloredImage, 0, 0, p.width, p.height);
  drawBackground = storePixels();

  resetCommon();

  Cone.reset();
  cones.length = 0;

  const rotationAngleStep = TWO_PI / 3;
  cones.push(
    Cone.create(0 * rotationAngleStep, 0.0005),
    Cone.create(1 * rotationAngleStep, -0.0005),
    Cone.create(2 * rotationAngleStep, 0.0015)
  );
};

export const initialize = (): void => {
  reset();
  resetSurfaceGraphics();
};

// ---- draw ----

const updateSketch = () => {
  cones.forEach(Cone.update);
};

const updateSurface = () => {
  setRenderer(surfaceGraphics);

  (renderer as any).erase(); // eslint-disable-line
  renderer.noStroke();
  renderer.fill(0);
  cones.forEach(Cone.draw);

  (renderer as any).noErase(); // eslint-disable-line
  renderer.stroke(0, 160);
  renderer.noFill();
  cones.forEach(Cone.draw);

  setRenderer(p);
};

const drawSketch = () => {
  restoreSurface();
  updateSurface();

  p.image(surfaceGraphics, 0, 0);
};

const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};

export const p5Methods = {
  draw,
  mouseClicked: reset
};
